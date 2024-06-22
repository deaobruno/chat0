import { Express, NextFunction, Request, Response } from 'express'
import IMiddleware from '../middlewares/IMiddleware'
import IRoomRepo from '../repositories/IRoomRepo'
import IUserRoomRepo from '../repositories/IUserRoomRepo'
import CreateRoomHandler from '../handlers/api/room/CreateRoomHandler'
import JoinRoomHandler from '../handlers/api/room/JoinRoomHandler'
import FindRoomsByTitleHandler from '../handlers/api/room/FindRoomsByTitleHandler'

type RoutesConfig = {
  app: Express
  authenticationMiddleware: IMiddleware
  roomRepo: IRoomRepo
  userRoomRepo: IUserRoomRepo
}

export default (config: RoutesConfig) => {
  const { app, roomRepo, userRoomRepo, authenticationMiddleware } = config

  app.post('/rooms', authenticationMiddleware, CreateRoomHandler(roomRepo, userRoomRepo))
  app.post('/rooms/:roomId/join', authenticationMiddleware, JoinRoomHandler(roomRepo, userRoomRepo))
  app.get('/rooms/title/:title', authenticationMiddleware, FindRoomsByTitleHandler(roomRepo))
}
