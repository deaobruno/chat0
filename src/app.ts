import { URL, URLSearchParams } from 'node:url'
import socketIo from 'socket.io'
import Db from './database/Db'
import UserRepo from './repositories/UserRepo'
import RoomRepo from './repositories/RoomRepo'
import UserRoomRepo from './repositories/UserRoomRepo'
import Server from './http/Server'

type Message = {
  author: string
  text: string
}

const db = Db({
  host: 'localhost',
  port: 27017,
  database: 'chat0',
})
const userRepo = UserRepo(db)
const roomRepo = RoomRepo(db)
const userRoomRepo = UserRoomRepo(db)
const server = Server({
  userRepo,
  roomRepo,
  userRoomRepo,
})
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

;(async () => {
  await db.initialize()
  server.listen(8081, () => console.log('server started'))
})()
