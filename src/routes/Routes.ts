import { Express } from 'express'
import IMiddleware from '../middlewares/IMiddleware'
import AuthRoutes from './AuthRoutes'
import RoomRoutes from './RoomRoutes'
import WebRoutes from './WebRoutes'
import IUserRepo from '../repositories/IUserRepo'
import IRoomRepo from '../repositories/IRoomRepo'
import IUserRoomRepo from '../repositories/IUserRoomRepo'

type RoutesConfig = {
  app: Express
  authenticationMiddleware: IMiddleware
  userRepo: IUserRepo
  roomRepo: IRoomRepo
  userRoomRepo: IUserRoomRepo
}

export default (config: RoutesConfig) => {
  AuthRoutes(config)
  RoomRoutes(config)
  WebRoutes(config.app)
}
