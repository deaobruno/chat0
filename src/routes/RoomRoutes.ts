import { Express, NextFunction, Request, Response } from 'express'
import IRoomRepo from '../repositories/IRoomRepo'
import IUserRoomRepo from '../repositories/IUserRoomRepo'
import createRoomHandler from '../handlers/api/room/createRoomHandler'
import joinRoomHandler from '../handlers/api/room/joinRoomHandler'
import findRoomsByTitleHandler from '../handlers/api/room/findRoomsByTitleHandler'

type RoutesConfig = {
  app: Express
  authenticationMiddleware: (req: Request, res: Response, next: NextFunction) => void
  roomRepo: IRoomRepo
  userRoomRepo: IUserRoomRepo
}

export default (config: RoutesConfig) => {
  const { app, roomRepo, userRoomRepo, authenticationMiddleware } = config

  app.post('/rooms', authenticationMiddleware, createRoomHandler(roomRepo, userRoomRepo))
  app.post('/rooms/:roomId/join', authenticationMiddleware, joinRoomHandler(userRoomRepo))
  app.get('/rooms/title/:title', authenticationMiddleware, findRoomsByTitleHandler(roomRepo))
}
