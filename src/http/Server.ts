import { createServer } from 'node:http'
import { join } from 'node:path'
import express, { json, urlencoded } from 'express'
import favicon from 'serve-favicon'
import ejs from 'ejs'
import IUserRepo from '../repositories/IUserRepo'
import IRoomRepo from '../repositories/IRoomRepo'
import IUserRoomRepo from '../repositories/IUserRoomRepo'
import notFoundHandler from '../handlers/web/notFoundHandler'
import errorHandler from '../handlers/web/errorHandler'
import AuthenticationMiddleware from '../middlewares/AuthenticationMiddleware'
import Routes from '../routes/Routes'

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
  Routes({
    app,
    userRepo,
    roomRepo,
    userRoomRepo,
    authenticationMiddleware,
  })
  app.use(notFoundHandler)
  app.use(errorHandler)

  return server
}
