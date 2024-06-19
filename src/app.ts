import Db from './database/Db'
import UserRepo from './repositories/UserRepo'
import RoomRepo from './repositories/RoomRepo'
import UserRoomRepo from './repositories/UserRoomRepo'
import Server from './http/Server'
import Socket from './socket/Socket'

const db = Db({
  host: 'localhost',
  port: 27017,
  database: 'chat0',
})
const userRepo = UserRepo(db)
const roomRepo = RoomRepo(db)
const userRoomRepo = UserRoomRepo(db)
const server = Server({
  userRepo,
  roomRepo,
  userRoomRepo,
})

;(async () => {
  try {
    Socket({
      server,
      roomRepo,
      userRoomRepo,
    })
    await db.initialize()
    server.listen(8081, () => console.log('server started'))
  } catch (error) {
    console.log(error)
  }
})()
