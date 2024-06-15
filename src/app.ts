import { createServer, STATUS_CODES } from 'node:http'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import express, { NextFunction, Request, Response, json, urlencoded } from 'express'
import { Server } from 'socket.io'
import ejs from 'ejs'
import { hash, compare } from 'bcrypt'

type User = {
  password: string
  logged: boolean
}

type Message = {
  author: string
  text: string
}

const app = express()
const server = createServer(app)
const io = new Server(server)
const publicDir = path.join(__dirname, '..', 'public')
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

  if (!username) {
    const error = new Error('Missing "username"')

    error['statusCode'] = 400

    return next(error)
  }

  if (!password) {
    const error = new Error('Missing "password"')

    error['statusCode'] = 400

    return next(error)
  }

  if (users[username]) {
    const error = new Error('"username" already in use')

    error['statusCode'] = 409

    return next(error)
  }

  const hashedPassword = await hash(password, 10)

  users[username] = { password: hashedPassword, logged: true }

  res.redirect(`/${randomUUID()}?u=${username}&p=${hashedPassword}`)
})
app.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body

  if (!username) {
    const error = new Error('Missing "username"')

    error['statusCode'] = 400

    return next(error)
  }

  if (!password) {
    const error = new Error('Missing "password"')

    error['statusCode'] = 400

    return next(error)
  }

  const user = users[username]

  if (!user) {
    const error = new Error('User not found')

    error['statusCode'] = 404

    return next(error)
  }

  if (!await compare(password, user.password)) {
    const error = new Error()

    error['statusCode'] = 401

    return next(error)
  }

  if (user.logged) {
    const error = new Error('User already logged')

    error['statusCode'] = 401

    return next(error)
  }

  user.logged = true

  res.redirect(`/${randomUUID()}?u=${username}&p=${user.password}`)
})
app.get('/:code', (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.params
  const { u: username, p: password } = req.query
  const uuidRegex = /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/i

  if (!code || !uuidRegex.test(code)) {
    const error = new Error('Invalid "code"')

    error['statusCode'] = 400

    return next(error)
  }

  if (!username) {
    const error = new Error('Missing "username"')

    error['statusCode'] = 400

    return next(error)
  }

  if (!password) {
    const error = new Error('Missing "password"')

    error['statusCode'] = 400

    return next(error)
  }

  const user = users[<string>username]

  if (!user) {
    const error = new Error('User not found')

    error['statusCode'] = 404

    return next(error)
  }

  if (user.password !== password) {
    const error = new Error()

    error['statusCode'] = 401

    return next(error)
  }

  if (!user.logged) {
    const error = new Error('User not logged')

    error['statusCode'] = 403

    return next(error)
  }

  if (!rooms[code]) rooms[code] = { messages: [], users: {} }

  if (rooms[code].users[<string>username]) {
    const error = new Error('User is already in room')

    error['statusCode'] = 403

    return next(error)
  }

  rooms[code].users[<string>username] = user

  res.render('chat.html', { username })
})
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error('Invalid URL')

  error['statusCode'] = 404

  next(error)
})
app.use((error: Error & { statusCode: number }, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = error

  if (!statusCode) statusCode = 500
  if (!message) message = STATUS_CODES[statusCode] ?? 'Internal Server Error'

  console.log(error)

  res
    .status(statusCode)
    .send(message)
})

io.on('connection', socket => {
  const code = socket.handshake.headers.referer?.split('/')[3].split('?')[0]

  console.log(`socket connected ${socket.id} ${code}`)

  if (!code) return console.log('code is empty')

  socket.join(code)

  if (rooms[code]) socket.emit('previousMessages', rooms[code].messages)

  socket
    .on('newMessage', (message: Message) => {
      rooms[code].messages.push(message)

      socket.to(code).emit('receivedMessage', message)
    })
})

server.listen(8081)
