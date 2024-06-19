import { Server } from 'node:http'
import { URL, URLSearchParams } from 'node:url'
import socketIo from 'socket.io'
import IRoomRepo from '../repositories/IRoomRepo'
import IUserRoomRepo from '../repositories/IUserRoomRepo'

type SocketConfig = {
  server: Server
  roomRepo: IRoomRepo
  userRoomRepo: IUserRoomRepo
}

type Message = {
  author: string
  text: string
}

export default (config: SocketConfig) => {
  const { server, roomRepo, userRoomRepo } = config
  const io = new socketIo.Server(server)

  io.on('connection', async socket => {
    const { referer } = socket.handshake.headers
  
    if (!referer) return console.log('referer is empty')
  
    const roomId = referer.split('/')[3].split('?')[0]
  
    if (!roomId) return console.log('roomId is empty')
  
    const room = await roomRepo.findOneByRoomId(roomId)
  
    if (!room) return console.log(`room does not exist: ${roomId}`)
  
    const url = new URL(referer)
    const username = new URLSearchParams(url.search).get('u')
    const roomUsers = await userRoomRepo.findByRoomId(room.roomId)
  
    if (username && !roomUsers) return console.log(`user is not in room: ${roomId} ${username}`)
  
    console.log(`socket: ${socket.id} / roomId: ${roomId} / username: ${username}`)
  
    socket.join(roomId)
    socket.emit('previousMessages', room.messages)
    socket
      .on('newMessage', (message: Message) => {
        room.messages.push(message)
        socket.to(roomId).emit('receivedMessage', message)
      })
  })
}
