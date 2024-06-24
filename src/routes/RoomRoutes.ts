import IRouter from './IRouter'
import IMiddleware from '../middlewares/IMiddleware'
import IController from '../controllers/IController'

type Dependencies = {
  authenticationMiddleware: IMiddleware
  insertRoomController: IController
  findRoomsByTitleController: IController
  joinRoomController: IController
  leaveRoomController: IController
}

export default (dependencies: Dependencies, router: IRouter) => {
  const {
    authenticationMiddleware,
    insertRoomController,
    findRoomsByTitleController,
    joinRoomController,
    leaveRoomController,
  } = dependencies

  router.post('/rooms', authenticationMiddleware(insertRoomController))
  router.get('/rooms/title/:title', authenticationMiddleware(findRoomsByTitleController))
  router.post('/rooms/:roomId/join', authenticationMiddleware(joinRoomController))
  router.delete('/rooms/:roomId/leave', authenticationMiddleware(leaveRoomController))
}
