import { createServer, STATUS_CODES } from 'node:http'
import path from 'node:path'
import { randomUUID } from 'node:crypto';
import express, { NextFunction, Request, Response, json, urlencoded } from 'express'
import { Server } from 'socket.io'
import ejs from 'ejs'

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

app.use(json())
app.use(urlencoded({ extended: false }))
app.use(express.static(publicDir))
app.set('views', publicDir)
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.get('/', (req: Request, res: Response) => res.render('home.html'))
app.post('/register', (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body

  if (users[username]) {
    const error = new Error('"username" already in use')

    error['statusCode'] = 409

    return next(error)
  }

  users[username] = { password, logged: true }

  res.redirect(`/${randomUUID()}?u=${username}&p=${password}`)
})
app.post('/login', (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body
  const user = users[username]

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

  user.logged = true

  res.redirect(`/${randomUUID()}?u=${username}&p=${password}`)
})
app.get('/:code', (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.params
  const { u: username, p: password } = req.query
  const uuidRegex =
    /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/i;

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

  res
    .status(statusCode)
    .send(message)
})

const rooms: { [code: string]: Message[] } = {}

io.on('connection', socket => {
  const code = socket.handshake.headers.referer?.split('/')[3].split('?')[0]

  console.log(`socket connected ${socket.id} ${code}`)

  if (!code) return console.log('code is empty')

  if (!rooms[code]) rooms[code] = []

  socket.join(code)
  socket.emit('previousMessages', rooms[code])
  socket
    .on('newMessage', (message: Message) => {
      console.log({rooms})
      rooms[code].push(message)

      socket.to(code).emit('receivedMessage', message)
    })
})

server.listen(8081)
