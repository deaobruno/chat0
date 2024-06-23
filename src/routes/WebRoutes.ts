import IRouter from './IRouter'
import IController from '../controllers/IController'

type Dependencies = {
  homeController: IController
  userRoomsController: IController
  createRoomController: IController
}

export default (dependencies: Dependencies, router: IRouter) => {
  const {
    homeController,
    userRoomsController,
    createRoomController,
  } = dependencies

  router.get('/', homeController)
  router.get('/users/rooms', userRoomsController)
  router.get('/create-room', createRoomController)
}
