import IRouter from './IRouter'
import IController from '../controllers/IController'

type Dependencies = {
  homeController: IController
  userRoomsController: IController
}

export default (dependencies: Dependencies, router: IRouter) => {
  const {
    homeController,
    userRoomsController,
  } = dependencies

  router.get('/', homeController)
  router.get('/users/rooms', userRoomsController)
  // router.get('/create-room', RenderCreateRoomHandler)
}
