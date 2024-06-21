import { Express, NextFunction, Request, Response } from 'express'
import IUserRepo from '../repositories/IUserRepo'
import registerHandler from '../handlers/auth/registerHandler'
import loginHandler from '../handlers/auth/loginHandler'
import logoutHandler from '../handlers/auth/logoutHandler'

type RoutesConfig = {
  app: Express
  authenticationMiddleware: (req: Request, res: Response, next: NextFunction) => void
  userRepo: IUserRepo
}

export default (config: RoutesConfig) => {
  const { app, userRepo, authenticationMiddleware } = config

  app.post('/auth/register', registerHandler(userRepo))
  app.post('/auth/login', loginHandler(userRepo))
  app.post('/auth/logout', authenticationMiddleware, logoutHandler(userRepo))
}
