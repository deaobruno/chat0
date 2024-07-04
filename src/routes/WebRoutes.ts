import dependenciesContainer from '../dependencies'
import IRouter from './IRouter'

export default (dependencies: typeof dependenciesContainer, router: IRouter) => {
  const {
    homeController,
    userRoomsController,
    createRoomController,
  } = dependencies

  router.get('/', homeController)
  router.get('/users/rooms', userRoomsController)
  router.get('/create-room', createRoomController)
}
