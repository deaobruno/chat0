import IRouter from './IRouter'
import IMiddleware from '../middlewares/IMiddleware'
import IController from '../controllers/IController'

type Dependencies = {
  authenticationMiddleware: IMiddleware
  registerController: IController
  loginController: IController
  logoutController: IController
}

export default (dependencies: Dependencies, router: IRouter) => {
  const {
    authenticationMiddleware,
    registerController,
    loginController,
    logoutController,
  } = dependencies

  router.post('/auth/register', registerController)
  router.post('/auth/login', loginController)
  router.post('/auth/logout', authenticationMiddleware(logoutController))
}
