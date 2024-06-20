import { Server } from 'node:http'
import { URL, URLSearchParams } from 'node:url'
import { randomUUID } from 'node:crypto'
import socketIo from 'socket.io'
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
  author: string
  text: string
  time: string
}

export default (config: SocketConfig) => {
  const { server, userRepo, roomRepo, userRoomRepo, messageRepo } = config
  const io = new socketIo.Server(server)

  io.on('connection', async socket => {
    const { referer } = socket.handshake.headers

    if (!referer) return console.log('[Socket] "referer" is empty')

    const roomId = referer.split('/')[4].split('?')[0]

    if (!roomId) return console.log('[Socket] "roomId" is empty')

    const room = await roomRepo.findOneByRoomId(roomId)

    if (!room) return console.log(`[Socket] Room does not exist: ${roomId}`)
    if (!room.isActive) return console.log(`[Socket] Room is not active: ${roomId}`)

    const url = new URL(referer)
    const username = new URLSearchParams(url.search).get('u')

    if (!username || typeof username !== 'string') return console.log(`[Socket] Invalid username: ${username}`)

    const user = await userRepo.findOneByUsername(username)

    if (!user) return console.log(`[Socket] User not found: ${username}`)

    const { userId } = user
    const roomUser = await userRoomRepo.findOneByUserIdAndRoomId(userId, roomId)

    if (!roomUser) return console.log(`[Socket] User is not in room: ${roomId} ${username}`)

    console.log(`[Socket] socket: ${socket.id} / roomId: ${roomId} / userId: ${userId}`)

    const messages = await messageRepo.findByRoomId(roomId)

    socket.join(roomId)
    socket.emit('previousMessages', messages)
    socket
      .on('newMessage', async (message: Message) => {
        const { text, time } = message

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
  })
}
