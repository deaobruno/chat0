import IRouter from './IRouter'
import IMiddleware from '../middlewares/IMiddleware'
import IController from '../controllers/IController'

type Dependencies = {
  authenticationMiddleware: IMiddleware
  loginController: IController
  logoutController: IController
}

export default (dependencies: Dependencies, router: IRouter) => {
  const {
    authenticationMiddleware,
    loginController,
    logoutController,
  } = dependencies

  // router.post('/auth/register', RegisterHandler(userRepo))
  router.post('/auth/login', loginController)
  router.post('/auth/logout', authenticationMiddleware(logoutController))
}
