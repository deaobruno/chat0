import IRouter from './IRouter'
import IMiddleware from '../middlewares/IMiddleware'
import IController from '../controllers/IController'

type Dependencies = {
  loginController: IController
  userRoomsController: IController
  createRoomController: IController
}

export default (dependencies: Dependencies, router: IRouter) => {
  const {
    loginController,
  } = dependencies

  // router.post('/auth/register', RegisterHandler(userRepo))
  router.post('/auth/login', loginController)
  // router.post('/auth/logout', authenticationMiddleware, LogoutHandler(userRepo))
}
