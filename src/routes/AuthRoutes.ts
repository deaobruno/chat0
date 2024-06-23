import IRouter from './IRouter'
import IMiddleware from '../middlewares/IMiddleware'
import IUserRepo from '../repositories/IUserRepo'
import RegisterHandler from '../handlers/api/auth/RegisterHandler'
import LoginHandler from '../handlers/api/auth/LoginHandler'
import LogoutHandler from '../handlers/api/auth/LogoutHandler'

type RoutesConfig = {
  router: IRouter
  authenticationMiddleware: IMiddleware
  userRepo: IUserRepo
}

export default (config: RoutesConfig) => {
  const { router, userRepo, authenticationMiddleware } = config

  // router.post('/auth/register', RegisterHandler(userRepo))
  // router.post('/auth/login', LoginHandler(userRepo))
  // router.post('/auth/logout', authenticationMiddleware, LogoutHandler(userRepo))
}
