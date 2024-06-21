import { Express, NextFunction, Request, Response } from 'express'
import IUserRepo from '../repositories/IUserRepo'
import IRoomRepo from '../repositories/IRoomRepo'
import IUserRoomRepo from '../repositories/IUserRoomRepo'
import insertRoomHandler from '../handlers/room/insertRoomHandler'

type RoutesConfig = {
  app: Express
  authenticationMiddleware: (req: Request, res: Response, next: NextFunction) => void
  userRepo: IUserRepo
  roomRepo: IRoomRepo
  userRoomRepo: IUserRoomRepo
}

export default (config: RoutesConfig) => {
  const { app, userRepo, roomRepo, userRoomRepo, authenticationMiddleware } = config

  app.post('/rooms', authenticationMiddleware, insertRoomHandler(userRepo, roomRepo, userRoomRepo))
}
