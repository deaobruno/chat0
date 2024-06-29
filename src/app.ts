import Crypto from './hash/Crypto'
import Bcrypt from './encryption/Bcrypt'
import Db from './database/Db'
import Server from './http/Server'
import Socket from './socket/Socket'
import Events from './events/Events'
import UserRepo from './repositories/UserRepo'
import RoomRepo from './repositories/RoomRepo'
import UserRoomRepo from './repositories/UserRoomRepo'
import MessageRepo from './repositories/MessageRepo'
import HomeController from './controllers/web/HomeController'
import UserRoomsController from './controllers/web/UserRoomsController'
import CreateRoomController from './controllers/web/CreateRoomController'
import LoginController from './controllers/api/auth/LoginController'
import AuthenticationMiddleware from './middlewares/AuthenticationMiddleware'
import LogoutController from './controllers/api/auth/LogoutController'
import RegisterController from './controllers/api/auth/RegisterController'
import NotFoundController from './controllers/web/NotFoundController'
import ErrorController from './controllers/web/ErrorController'
import InsertRoomController from './controllers/api/room/InsertRoomController'
import FindRoomsByTitleController from './controllers/api/room/FindRoomsByTitleController'
import JoinRoomController from './controllers/api/room/JoinRoomController'
import LeaveRoomController from './controllers/api/room/LeaveRoomController'
import NewMessageEvent from './events/NewMessageEvent'
import GetRoomsByUserIdUseCase from './useCases/room/GetRoomsByUserIdUseCase'
import AuthenticateUseCase from './useCases/auth/AuthenticateUseCase'

// Drivers
const db = Db({
  host: 'localhost',
  port: 27017,
  database: 'chat0',
})
const hash = Crypto()
const encryption = Bcrypt()
const events = Events()
// Repositories
const userRepo = UserRepo(db)
const roomRepo = RoomRepo(db)
const userRoomRepo = UserRoomRepo(db)
const messageRepo = MessageRepo(db)
// Use Cases
const authenticateUseCase = AuthenticateUseCase({
  encryption,
  userRepo,
})
const getRoomByUserIdUseCase = GetRoomsByUserIdUseCase({
  roomRepo,
  userRoomRepo,
  messageRepo,
})
// Middlewares
const authenticationMiddleware = AuthenticationMiddleware(authenticateUseCase)
// Controllers
const homeController = HomeController()
const userRoomsController = UserRoomsController()
const createRoomController = CreateRoomController()
const notFoundController = NotFoundController()
const errorController = ErrorController()
const registerController = RegisterController(hash, encryption, userRepo)
const loginController = LoginController(encryption, userRepo)
const logoutController = LogoutController(userRepo)
const insertRoomController = InsertRoomController(hash, roomRepo, userRoomRepo)
const findRoomsByTitleController = FindRoomsByTitleController(roomRepo)
const joinRoomController = JoinRoomController(hash, roomRepo, userRoomRepo)
const leaveRoomController = LeaveRoomController(roomRepo, userRoomRepo)
// Events
const newMessageEvent = NewMessageEvent({
  hash,
  messageRepo,
})
// Servers
const server = Server({
  authenticationMiddleware,
  homeController,
  userRoomsController,
  createRoomController,
  notFoundController,
  errorController,
  registerController,
  loginController,
  logoutController,
  insertRoomController,
  findRoomsByTitleController,
  joinRoomController,
  leaveRoomController,
})
Socket({
  server,
  events,
  authenticateUseCase,
  getRoomByUserIdUseCase,
})

events.subscribe('newMessage', newMessageEvent)

;(async () => {
  try {
    await db.initialize()
    server.listen(8081, () => console.log('[Server] HTTP server started'))
  } catch (error) {
    console.log(error)
  }
})()
