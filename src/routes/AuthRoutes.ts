import { Express } from 'express'
import IMiddleware from '../middlewares/IMiddleware'
import IUserRepo from '../repositories/IUserRepo'
import RegisterHandler from '../handlers/api/auth/RegisterHandler'
import LoginHandler from '../handlers/api/auth/LoginHandler'
import LogoutHandler from '../handlers/api/auth/LogoutHandler'

type RoutesConfig = {
  app: Express
  authenticationMiddleware: IMiddleware
  userRepo: IUserRepo
}

export default (config: RoutesConfig) => {
  const { app, userRepo, authenticationMiddleware } = config

  app.post('/auth/register', RegisterHandler(userRepo))
  app.post('/auth/login', LoginHandler(userRepo))
  app.post('/auth/logout', authenticationMiddleware, LogoutHandler(userRepo))
}
