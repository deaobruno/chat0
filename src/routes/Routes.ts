import { Express, NextFunction, Request, Response } from 'express'
import AuthRoutes from './AuthRoutes'
import RoomRoutes from './RoomRoutes'
import WebRoutes from './WebRoutes'
import IUserRepo from '../repositories/IUserRepo'
import IRoomRepo from '../repositories/IRoomRepo'
import IUserRoomRepo from '../repositories/IUserRoomRepo'

type RoutesConfig = {
  app: Express
  authenticationMiddleware: (req: Request, res: Response, next: NextFunction) => void
  userRepo: IUserRepo
  roomRepo: IRoomRepo
  userRoomRepo: IUserRoomRepo
}

export default (config: RoutesConfig) => {
  AuthRoutes(config)
  RoomRoutes(config)
  WebRoutes(config.app)
}
