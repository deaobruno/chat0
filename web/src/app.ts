import { createServer } from 'node:http'
import { join } from 'node:path'
import express, { NextFunction, Request, Response } from 'express'
import favicon from 'serve-favicon'
import ejs from 'ejs'

const app = express()
const server = createServer(app)
const publicDir = join(__dirname, '..', 'public')
const htmlDir = join(publicDir, 'html')

app.use(express.static(publicDir))
app.use(favicon(join(publicDir, 'images', 'favicon.ico')))
app.set('views', htmlDir)
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.get('/', (req: Request, res: Response) =>
  res.render('home.html'))
app.get('/users/rooms', (req: Request, res: Response) =>
  res.render('user-rooms.html'))
app.get('/create-room', (req: Request, res: Response) =>
  res.render('create-room.html'))
app.use((req: Request, res: Response) =>
  res.status(404).render('not-found.html'))
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(error)
  res.status(500).render('error.html')
})

const port = 8081
const httpServer = server
  .listen(port, () => {
    const serverAddress = httpServer.address()
    let address = 'localhost'

    if (
      serverAddress &&
      typeof serverAddress === 'object' &&
      serverAddress.address !== '::'
    )
      address = serverAddress.address

    console.log(
      `[Web] Express HTTP Server started: http://${address}:${port}.`,
    )
  })
  .on('close', () => console.log('[Web] Express HTTP Server stopped'))
  .on('error', (error) => console.log(error))
