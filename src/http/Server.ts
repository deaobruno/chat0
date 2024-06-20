import { createServer } from 'node:http'
import { join } from 'node:path'
import express, { json, urlencoded } from 'express'
import favicon from 'serve-favicon'
import ejs from 'ejs'
import IUserRepo from '../repositories/IUserRepo'
import IRoomRepo from '../repositories/IRoomRepo'
import IUserRoomRepo from '../repositories/IUserRoomRepo'
import homeHandler from '../handlers/web/homeHandler'
import notFoundHandler from '../handlers/web/notFoundHandler'
import errorHandler from '../handlers/web/errorHandler'
import registerHandler from '../handlers/auth/registerHandler'
import loginHandler from '../handlers/auth/loginHandler'
import logoutHandler from '../handlers/auth/logoutHandler'
import getRoomByIdHandler from '../handlers/room/getRoomByIdHandler'
import getRoomsByUserIdHandler from '../handlers/room/getRoomsByUserIdHandler'
import createRoomHandler from '../handlers/room/createRoomHandler'
import insertRoomHandler from '../handlers/room/insertRoomHandler'
import AuthenticationMiddleware from '../middlewares/AuthenticationMiddleware'

type ServerConfig = {
  userRepo: IUserRepo
  roomRepo: IRoomRepo
  userRoomRepo: IUserRoomRepo
}

export default (config: ServerConfig) => {
  const { userRepo, roomRepo, userRoomRepo } = config
  const app = express()
  const server = createServer(app)
  const authenticationMiddleware = AuthenticationMiddleware(userRepo)
  const publicDir = join(__dirname, '..', '..', 'public')

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
  app.post('/logout', authenticationMiddleware, logoutHandler(userRepo))
  app.get('/create-room', createRoomHandler)
  app.post('/rooms', authenticationMiddleware, insertRoomHandler(userRepo, roomRepo, userRoomRepo))
  app.get('/rooms/:roomId', getRoomByIdHandler(userRepo, roomRepo, userRoomRepo))
  app.get('/users/:userId/rooms', getRoomsByUserIdHandler(userRepo, roomRepo, userRoomRepo))
  app.use(notFoundHandler)
  app.use(errorHandler)

  return server
}
