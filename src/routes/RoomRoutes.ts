import IRouter from './IRouter'
import IMiddleware from '../middlewares/IMiddleware'
import IRoomRepo from '../repositories/IRoomRepo'
import IUserRoomRepo from '../repositories/IUserRoomRepo'
import CreateRoomHandler from '../handlers/api/room/CreateRoomHandler'
import JoinRoomHandler from '../handlers/api/room/JoinRoomHandler'
import FindRoomsByTitleHandler from '../handlers/api/room/FindRoomsByTitleHandler'

type RoutesConfig = {
  router: IRouter
  authenticationMiddleware: IMiddleware
  roomRepo: IRoomRepo
  userRoomRepo: IUserRoomRepo
}

export default (config: RoutesConfig) => {
  const { router, roomRepo, userRoomRepo, authenticationMiddleware } = config

  // router.post('/rooms', authenticationMiddleware, CreateRoomHandler(roomRepo, userRoomRepo))
  // router.post('/rooms/:roomId/join', authenticationMiddleware, JoinRoomHandler(roomRepo, userRoomRepo))
  // router.get('/rooms/title/:title', authenticationMiddleware, FindRoomsByTitleHandler(roomRepo))
}
