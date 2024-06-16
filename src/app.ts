import { createServer } from 'node:http'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { URL, URLSearchParams } from 'node:url'
import express, { NextFunction, Request, Response, json, urlencoded } from 'express'
import { Server } from 'socket.io'
import ejs from 'ejs'
import { hash, compare } from 'bcrypt'
import BadRequestError from './errors/BadRequestError'
import UnauthorizedError from './errors/UnauthorizedError'
import ForbiddenError from './errors/ForbiddenError'
import NotFoundError from './errors/NotFoundError'
import ConflictError from './errors/ConflictError'
import BaseError from './errors/BaseError'
import InternalServerError from './errors/InternalServerError'

type User = {
  password: string
  logged: boolean
  rooms: string[]
}

type Message = {
  author: string
  text: string
}

const app = express()
const server = createServer(app)
const io = new Server(server)
const publicDir = join(__dirname, '..', 'public')
const users: { [username: string]: User } = {}
const rooms: { [code: string]: { messages: Message[], users: { [username: string]: User } } } = {}

app.use(json())
app.use(urlencoded({ extended: false }))
app.use(express.static(publicDir))
app.set('views', publicDir)
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.get('/', (req: Request, res: Response) => res.render('home.html'))
app.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body

  if (!username) return next(new BadRequestError('Missing "username"'))
  if (!password) return next(new BadRequestError('Missing "password"'))
  if (users[username]) return next(new ConflictError('"username" already in use'))

  const hashedPassword = await hash(password, 10)
  const roomId = randomUUID()

  users[username] = { password: hashedPassword, logged: true, rooms: [roomId] }

  res.redirect(`/${roomId}?u=${username}&p=${hashedPassword}`)
})
app.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body

  if (!username) return next(new BadRequestError('Missing "username"'))
  if (!password) return next(new BadRequestError('Missing "password"'))

  const user = users[username]

  if (!user) return next(new NotFoundError('User not found'))
  if (!await compare(password, user.password)) return next(new UnauthorizedError())
  if (user.logged) return next(new UnauthorizedError('User already logged'))

  const roomId = randomUUID()

  user.rooms.push(roomId)
  user.logged = true

  res.redirect(`/${roomId}?u=${username}&p=${user.password}`)
})
app.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.body

  if (!username) return next(new BadRequestError('Missing "username"'))

  const user = users[username]

  if (!user) return next(new NotFoundError('User not found'))
  if (!user.logged) return next(new UnauthorizedError('User not logged'))

  user.rooms.forEach(room => delete rooms[room].users[username])
  user.rooms = []
  user.logged = false

  res.redirect('/')
})
app.get('/:code', (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.params
  const { u: username, p: password } = req.query
  const uuidRegex = /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/i

  if (!code || !uuidRegex.test(code)) return next(new BadRequestError('Invalid "code"'))
  if (!username) return next(new BadRequestError('Missing "username"'))
  if (!password) return next(new BadRequestError('Missing "password"'))

  const user = users[<string>username]

  if (!user) return next(new NotFoundError('User not found'))
  if (user.password !== password) return next(new UnauthorizedError())
  if (!user.logged) return next(new ForbiddenError('User not logged'))
  if (!rooms[code]) rooms[code] = { messages: [], users: {} }

  rooms[code].users[<string>username] = user

  res.render('chat.html', { username })
})
app.use((req: Request, res: Response, next: NextFunction) => next(new NotFoundError('Invalid URL')))
app.use((error: BaseError, req: Request, res: Response, next: NextFunction): void => {
  let { statusCode, message } = error

  if (!statusCode) error = new InternalServerError(message)

  console.log(error)

  res
    .status(statusCode)
    .send(message)
})

io.on('connection', socket => {
  const code = socket.handshake.headers.referer?.split('/')[3].split('?')[0]
  const url = new URL(<string>socket.handshake.headers.referer)
  const username = new URLSearchParams(url.search).get('u')

  if (!code) return console.log('code is empty')

  const room = rooms[code]

  if (!room) return console.log(`room does not exist: ${code}`)
  if (username && !room.users[username]) return console.log(`user is not in room: ${code} ${username}`)

  console.log(`socket: ${socket.id} / code: ${code} / username: ${username}`)

  socket.join(code)

  if (room) socket.emit('previousMessages', room.messages)

  socket
    .on('newMessage', (message: Message) => {
      room.messages.push(message)
      socket.to(code).emit('receivedMessage', message)
    })
})

server.listen(8081)
