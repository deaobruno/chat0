import IRouter from './IRouter'
import IMiddleware from '../middlewares/IMiddleware'
import IController from '../controllers/IController'

type Dependencies = {
  authenticationMiddleware: IMiddleware
  insertRoomController: IController
  joinRoomController: IController
  findRoomsByTitleController: IController
}

export default (dependencies: Dependencies, router: IRouter) => {
  const {
    authenticationMiddleware,
    insertRoomController,
    joinRoomController,
    findRoomsByTitleController,
  } = dependencies

  router.post('/rooms', authenticationMiddleware(insertRoomController))
  router.post('/rooms/:roomId/join', authenticationMiddleware(joinRoomController))
  router.get('/rooms/title/:title', authenticationMiddleware(findRoomsByTitleController))
}
