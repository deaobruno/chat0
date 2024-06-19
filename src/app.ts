import { createServer } from 'node:http'
import { join } from 'node:path'
import { URL, URLSearchParams } from 'node:url'
import express, { json, urlencoded } from 'express'
import favicon from 'serve-favicon'
import { Server } from 'socket.io'
import ejs from 'ejs'
import db from './database/db'
import UserRepo from './repositories/UserRepo'
import RoomRepo from './repositories/RoomRepo'
import UserRoomRepo from './repositories/UserRoomRepo'
import homeHandler from './handlers/web/homeHandler'
import notFoundHandler from './handlers/web/notFoundHandler'
import errorHandler from './handlers/web/errorHandler'
import registerHandler from './handlers/auth/registerHandler'
import loginHandler from './handlers/auth/loginHandler'
import logoutHandler from './handlers/auth/logoutHandler'
import getRoomByIdHandler from './handlers/room/getRoomByIdHandler'
import getRoomsByUserIdHandler from './handlers/room/getRoomsByUserIdHandler'

type Message = {
  author: string
  text: string
}

const app = express()
const server = createServer(app)
const io = new Server(server)
const publicDir = join(__dirname, '..', 'public')
const userRoomRepo = UserRoomRepo
const userRepo = UserRepo
const roomRepo = RoomRepo

app.use(json())
app.use(urlencoded({ extended: false }))
app.use(express.static(publicDir))
app.use(favicon(join(publicDir, 'favicon.ico')))
app.set('views', publicDir)
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.get('/', homeHandler)
app.post('/register', registerHandler(userRepo))
app.post('/login', loginHandler(userRepo))
app.post('/logout', logoutHandler(userRepo, roomRepo))
app.get('/rooms/:roomId', getRoomByIdHandler(userRepo, roomRepo, userRoomRepo))
app.get('/users/:userId/rooms', getRoomsByUserIdHandler(userRepo, roomRepo, userRoomRepo))
app.use(notFoundHandler)
app.use(errorHandler)

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
