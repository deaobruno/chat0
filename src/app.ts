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

const db = Db({
  host: 'localhost',
  port: 27017,
  database: 'chat0',
})
const userRepo = UserRepo(db)
const roomRepo = RoomRepo(db)
const userRoomRepo = UserRoomRepo(db)
const messageRepo = MessageRepo(db)
const homeController = HomeController()
const userRoomsController = UserRoomsController()
const createRoomController = CreateRoomController()
const notFoundController = NotFoundController()
const server = Server({
  homeController,
  userRoomsController,
  createRoomController,
  notFoundController,
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
