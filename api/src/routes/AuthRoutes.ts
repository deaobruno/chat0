import dependenciesContainer from '../dependencies'
import IRouter from './IRouter'

export default (dependencies: typeof dependenciesContainer, router: IRouter) => {
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
