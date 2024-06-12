import { createServer } from 'node:http'
import path from 'node:path'
import express, { NextFunction, Request, Response } from 'express'
import { Server } from 'socket.io'
import ejs from 'ejs'

type Message = {
  author: string
  text: string
}

const app = express()
const server = createServer(app)
const io = new Server(server)
const publicDir = path.join(__dirname, '../', 'public')

app.use(express.static(publicDir))
app.set('views', publicDir)
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.get('/', (req: Request, res: Response) => res.render('chat.html'))
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error('Invalid URL')

  error['statusCode'] = 404

  next(error)
})
app.use((error: Error & { statusCode: number }, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = error

  if (!statusCode) statusCode = 500
  if (!message) message = 'Internal Server Error'

  res
    .status(statusCode)
    .send(message)
})

const messages: Message[] = []

io.on('connection', socket => {
  console.log(`socket connected ${socket.id}`)

  socket.emit('previousMessages', messages)
  socket.on('newMessage', (message: Message) => {
    messages.push(message)

    socket.broadcast.emit('receivedMessage', message)
  })
})

server.listen(8081)
