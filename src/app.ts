import Db from './database/Db'
import UserRepo from './repositories/UserRepo'
import RoomRepo from './repositories/RoomRepo'
import UserRoomRepo from './repositories/UserRoomRepo'
import Server from './http/Server'
import Socket from './socket/Socket'
import MessageRepo from './repositories/MessageRepo'
import HomeController from './controllers/web/HomeController'
import UserRoomsController from './controllers/web/UserRoomsController'
import CreateRoomController from './controllers/web/CreateRoomController'
import NotFoundController from './controllers/web/NotFoundController'
import ErrorController from './controllers/web/ErrorController'
import LoginController from './controllers/api/auth/LoginController'
import Bcrypt from './encryption/Bcrypt'

const db = Db({
  host: 'localhost',
  port: 27017,
  database: 'chat0',
})
const encryption = Bcrypt()
const userRepo = UserRepo(db)
const roomRepo = RoomRepo(db)
const userRoomRepo = UserRoomRepo(db)
const messageRepo = MessageRepo(db)
const homeController = HomeController()
const userRoomsController = UserRoomsController()
const createRoomController = CreateRoomController()
const notFoundController = NotFoundController()
const errorController = ErrorController()
const loginController = LoginController(userRepo, encryption)
const server = Server({
  homeController,
  userRoomsController,
  createRoomController,
  notFoundController,
  errorController,
  loginController,
})

;(async () => {
  try {
    Socket({
      server,
      userRepo,
      roomRepo,
      userRoomRepo,
      messageRepo,
    })
    await db.initialize()
    server.listen(8081, () => console.log('[Server] HTTP server started'))
  } catch (error) {
    console.log(error)
  }
})()
