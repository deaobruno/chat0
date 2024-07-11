import dependenciesContainer from '../../dependencies'
import IRouter from './IRouter'

export default (dependencies: typeof dependenciesContainer, router: IRouter) => {
  const {
    authenticationMiddleware,
    insertRoomController,
    findRoomsByTitleController,
    joinRoomController,
    leaveRoomController,
    deleteRoomController,
  } = dependencies

  router.post('/rooms', authenticationMiddleware(insertRoomController))
  router.get('/rooms/title/:title', authenticationMiddleware(findRoomsByTitleController))
  router.post('/rooms/:roomId/join', authenticationMiddleware(joinRoomController))
  router.delete('/rooms/:roomId', authenticationMiddleware(deleteRoomController))
  router.delete('/rooms/:roomId/leave', authenticationMiddleware(leaveRoomController))
}
