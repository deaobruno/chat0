import IRouter from './IRouter'
import IController from '../controllers/IController'

type Dependencies = {
  homeController: IController
}

export default (dependencies: Dependencies, router: IRouter) => {
  const { homeController } = dependencies

  router.get('/', homeController)
  // router.get('/create-room', RenderCreateRoomHandler)
  // router.get('/users/rooms', RenderRoomsByUserIdHandler)
}
