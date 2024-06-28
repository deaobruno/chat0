import { Server } from 'node:http'
import socketIo from 'socket.io'
import { compare } from 'bcrypt'
import IEvents from '../events/IEvents'
import IUserRepo from '../repositories/IUserRepo'
import IGetRoomsByUserIdUseCase from '../useCases/room/IGetRoomsByUserIdUseCase'

type SocketConfig = {
  server: Server
  events: IEvents
  userRepo: IUserRepo
  getRoomByUserIdUseCase: IGetRoomsByUserIdUseCase
}

type Message = {
  text: string
  time: string
  roomId: string
}

export default (config: SocketConfig) => {
  const {
    server,
    events,
    userRepo,
    getRoomByUserIdUseCase,
  } = config
  const io = new socketIo.Server(server)

  io.on('connection', async socket => {
    try {
      const { token } = socket.handshake.auth

      if (!token) return console.log('[Socket] Authentication is missing')

      const [username, password] = Buffer
        .from(token, 'base64')
        .toString()
        .split(':')

      if (!username) return console.log('[Socket] Invalid "username"')

      const user = await userRepo.findOneByUsername(username)

      if (!user) return console.log('[Socket] User not found')
      if (!await compare(password, user.password))
        return console.log('[Socket] Authentication failed')
      if (!user.isLogged) return console.log('[Socket] User not logged')

      const { userId } = user

      socket
        .on('newMessage', (message: Message) => {
          events.publish('newMessage', { userId, message, author: username })
          socket.to(message.roomId).emit('receivedMessage', message)
        })
        .on('getRoomsUpdate', async () => {
          const rooms = await getRoomByUserIdUseCase(userId)

          rooms.forEach(room => socket.join(room.roomId))
          socket.emit('updateRooms', rooms)
        })
    } catch (error) {
      console.log(`[Socket] ${error}`)
    }
  })
}
