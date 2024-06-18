import { createServer } from 'node:http'
import { join } from 'node:path'
import { URL, URLSearchParams } from 'node:url'
import express, { json, urlencoded } from 'express'
import favicon from 'serve-favicon'
import { Server } from 'socket.io'
import ejs from 'ejs'
import homeHandler from './handlers/web/homeHandler'
import notFoundHandler from './handlers/web/notFoundHandler'
import errorHandler from './handlers/web/errorHandler'
import registerHandler from './handlers/auth/registerHandler'
import loginHandler from './handlers/auth/loginHandler'
import logoutHandler from './handlers/auth/logoutHandler'
import UserRepo from './repositories/UserRepo'
import RoomRepo from './repositories/RoomRepo'
import getRoomByIdHandler from './handlers/room/getRoomByIdHandler'
import UserRoomRepo from './repositories/UserRoomRepo'
import getRoomsByUserIdHandler from './handlers/room/getRoomsByUserIdHandler'

type Message = {
  author: string
  text: string
}

const app = express()
const server = createServer(app)
const io = new Server(server)
const publicDir = join(__dirname, '..', 'public')
const userRoomRepo = UserRoomRepo()
const userRepo = UserRepo(userRoomRepo)
const roomRepo = RoomRepo(userRoomRepo)

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
app.get('/rooms/:room_id', getRoomByIdHandler(userRepo, roomRepo))
app.get('/users/:user_id/rooms', getRoomsByUserIdHandler(userRepo, roomRepo))
app.use(notFoundHandler)
app.use(errorHandler)

io.on('connection', async socket => {
  const { referer } = socket.handshake.headers

  if (!referer) return console.log('referer is empty')

  const room_id = referer.split('/')[3].split('?')[0]

  if (!room_id) return console.log('room_id is empty')

  const room = await roomRepo.findOneById(room_id)

  if (!room) return console.log(`room does not exist: ${room_id}`)

  const url = new URL(referer)
  const username = new URLSearchParams(url.search).get('u')

  if (username && !room.users[username]) return console.log(`user is not in room: ${room_id} ${username}`)

  console.log(`socket: ${socket.id} / room_id: ${room_id} / username: ${username}`)

  socket.join(room_id)
  socket.emit('previousMessages', room.messages)
  socket
    .on('newMessage', (message: Message) => {
      room.messages.push(message)
      socket.to(room_id).emit('receivedMessage', message)
    })
})

server.listen(8081)
