import config from './config'
import Crypto from './infra/drivers/hash/Crypto'
import Bcrypt from './infra/drivers/encryption/Bcrypt'
import Db from './infra/drivers/database/Db'
import Server from './infra/drivers/http/Server'
import Socket from './infra/drivers/socket/Socket'
import Events from './infra/drivers/events/Events'
import UserRepo from './adapters/repositories/UserRepo'
import RoomRepo from './adapters/repositories/RoomRepo'
import UserRoomRepo from './adapters/repositories/UserRoomRepo'
import MessageRepo from './adapters/repositories/MessageRepo'
import GetRoomsByUserIdUseCase from './application/useCases/room/GetRoomsByUserIdUseCase'
import AuthenticateUseCase from './application/useCases/auth/AuthenticateUseCase'
import LoginUseCase from './application/useCases/auth/LoginUseCase'
import LogoutUseCase from './application/useCases/auth/LogoutUseCase'
import RegisterUseCase from './application/useCases/auth/RegisterUseCase'
import FindRoomsByTitleUseCase from './application/useCases/room/FindRoomsByTitleUseCase'
import InsertRoomUseCase from './application/useCases/room/InsertRoomUseCase'
import JoinRoomUseCase from './application/useCases/room/JoinRoomUseCase'
import LeaveRoomUseCase from './application/useCases/room/LeaveRoomUseCase'
import DeleteRoomUseCase from './application/useCases/room/DeleteRoomUseCase'
import CreateMessageUseCase from './application/useCases/message/CreateMessageUseCase'
import AuthenticationMiddleware from './adapters/middlewares/AuthenticationMiddleware'
import LoginController from './adapters/controllers/auth/LoginController'
import LogoutController from './adapters/controllers/auth/LogoutController'
import RegisterController from './adapters/controllers/auth/RegisterController'
import InsertRoomController from './adapters/controllers/room/InsertRoomController'
import FindRoomsByTitleController from './adapters/controllers/room/FindRoomsByTitleController'
import JoinRoomController from './adapters/controllers/room/JoinRoomController'
import LeaveRoomController from './adapters/controllers/room/LeaveRoomController'
import DeleteRoomController from './adapters/controllers/room/DeleteRoomController'
import NewMessageEvent from './adapters/events/NewMessageEvent'

// Drivers
const dbDriver = Db(config.db.mongo)
const hash = Crypto()
const encryption = Bcrypt()
const events = Events()
// Repositories
const userRepo = UserRepo(dbDriver, config.db.sources.user)
const roomRepo = RoomRepo(dbDriver, config.db.sources.room)
const userRoomRepo = UserRoomRepo(dbDriver, config.db.sources.userRoom)
const messageRepo = MessageRepo(dbDriver, config.db.sources.message)
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
const httpServer = Server(config.http.port)
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
