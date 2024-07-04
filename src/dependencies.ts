import config from './config'
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
import GetRoomsByUserIdUseCase from './useCases/room/GetRoomsByUserIdUseCase'
import AuthenticateUseCase from './useCases/auth/AuthenticateUseCase'
import LoginUseCase from './useCases/auth/LoginUseCase'
import LogoutUseCase from './useCases/auth/LogoutUseCase'
import RegisterUseCase from './useCases/auth/RegisterUseCase'
import FindRoomsByTitleUseCase from './useCases/room/FindRoomsByTitleUseCase'
import InsertRoomUseCase from './useCases/room/InsertRoomUseCase'
import JoinRoomUseCase from './useCases/room/JoinRoomUseCase'
import LeaveRoomUseCase from './useCases/room/LeaveRoomUseCase'
import DeleteRoomUseCase from './useCases/room/DeleteRoomUseCase'
import CreateMessageUseCase from './useCases/message/CreateMessageUseCase'
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
import DeleteRoomController from './controllers/api/room/DeleteRoomController'
import NewMessageEvent from './events/NewMessageEvent'

// Drivers
const dbDriver = Db(config.db.mongo)
const { db } = dbDriver
const hash = Crypto()
const encryption = Bcrypt()
const events = Events()
// Repositories
const userRepo = UserRepo(db)
const roomRepo = RoomRepo(db)
const userRoomRepo = UserRoomRepo(db)
const messageRepo = MessageRepo(db)
// Use Cases
const registerUseCase = RegisterUseCase({
  hash,
  encryption,
  userRepo,
})
const loginUseCase = LoginUseCase({
  encryption,
  userRepo,
})
const logoutUseCase = LogoutUseCase({
  userRepo,
})
const authenticateUseCase = AuthenticateUseCase({
  encryption,
  userRepo,
})
const insertRoomUseCase = InsertRoomUseCase({
  hash,
  roomRepo,
  userRoomRepo,
})
const findRoomsByTitleUseCase = FindRoomsByTitleUseCase({
  roomRepo,
})
const joinRoomUseCase = JoinRoomUseCase({
  hash,
  roomRepo,
  userRoomRepo,
})
const getRoomsByUserIdUseCase = GetRoomsByUserIdUseCase({
  roomRepo,
  userRoomRepo,
  messageRepo,
})
const leaveRoomUseCase = LeaveRoomUseCase({
  roomRepo,
  userRoomRepo,
  messageRepo,
})
const deleteRoomUseCase = DeleteRoomUseCase({
  roomRepo,
  userRoomRepo,
  messageRepo,
})
const createMessageUseCase = CreateMessageUseCase({
  hash,
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
const registerController = RegisterController(registerUseCase)
const loginController = LoginController(loginUseCase)
const logoutController = LogoutController(logoutUseCase)
const insertRoomController = InsertRoomController(insertRoomUseCase)
const findRoomsByTitleController = FindRoomsByTitleController(findRoomsByTitleUseCase)
const joinRoomController = JoinRoomController(joinRoomUseCase)
const leaveRoomController = LeaveRoomController(leaveRoomUseCase)
const deleteRoomController = DeleteRoomController(deleteRoomUseCase)
// Events
const newMessageEvent = NewMessageEvent(createMessageUseCase)
// Servers
const httpServer = Server(config.http.port, {
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
  deleteRoomController,
})
const { server } = httpServer
Socket({
  server,
  events,
  authenticateUseCase,
  getRoomsByUserIdUseCase,
})

export default {
  httpServer,
  dbDriver,
  events,
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
  deleteRoomController,
  newMessageEvent,
}
