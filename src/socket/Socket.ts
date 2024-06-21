import { Server } from 'node:http'
import { randomUUID } from 'node:crypto'
import socketIo from 'socket.io'
import { compare } from 'bcrypt'
import IUserRepo from '../repositories/IUserRepo'
import IRoomRepo from '../repositories/IRoomRepo'
import IUserRoomRepo from '../repositories/IUserRoomRepo'
import IMessageRepo from '../repositories/IMessageRepo'
import MessageType from '../entity/message/MessageType'
import MessageStatus from '../entity/message/MessageStatus'

type SocketConfig = {
  server: Server
  userRepo: IUserRepo
  roomRepo: IRoomRepo
  userRoomRepo: IUserRoomRepo
  messageRepo: IMessageRepo
}

type Message = {
  text: string
  time: string
  roomId: string
}

export default (config: SocketConfig) => {
  const { server, userRepo, roomRepo, userRoomRepo, messageRepo } = config
  const io = new socketIo.Server(server)

  io.on('connection', async socket => {
    try {
      const { token } = socket.handshake.auth

      if (!token) return console.log('[Socket] Authentication is missing')

      const [username, password] = Buffer.from(token, 'base64').toString().split(':')

      if (!username) return console.log('[Socket] Invalid "username"')

      const user = await userRepo.findOneByUsername(username)

      if (!user) return console.log('[Socket] User not found')
      if (!await compare(password, user.password))
        return console.log('[Socket] Authentication failed')
      if (!user.isLogged) return console.log('[Socket] User not logged')

      const { userId } = user
      const userRooms = await userRoomRepo.findByUserId(userId)
      const rooms = await Promise.all(userRooms.map(async userRoom => {
        const { roomId } = userRoom
        const room = await roomRepo.findOneByRoomId(roomId)

        ;(await messageRepo.findLastMessagesByRoomId(roomId))
          .reverse()
          .forEach(message => room?.addMessage(message))

        socket.join(roomId)

        return room
      }))

      socket.emit('updateRooms', rooms)
      socket
        .on('newMessage', async (message: Message) => {
          const { roomId, text, time  } = message

          await messageRepo.insert({
            messageId: randomUUID(),
            roomId,
            userId,
            author: username,
            text,
            time: new Date(time),
            type: MessageType.TEXT,
            status: MessageStatus.SENT,
          })

          socket.to(roomId).emit('receivedMessage', message)
        })
        .on('getRoomsUpdate', async () => {
          const userRooms = await userRoomRepo.findByUserId(userId)
          const rooms = await Promise.all(userRooms.map(async userRoom => {
            const { roomId } = userRoom
            const room = await roomRepo.findOneByRoomId(roomId)
    
            ;(await messageRepo.findLastMessagesByRoomId(roomId))
              .reverse()
              .forEach(message => room?.addMessage(message))
    
            socket.join(roomId)
    
            return room
          }))

          socket.emit('updateRooms', rooms)
        })
    } catch (error) {
      console.log(`[Socket] ${error}`)
    }
  })
}
