import { Express } from 'express'
import homeHandler from '../handlers/web/homeHandler'
import renderRoomsByUserIdHandler from '../handlers/room/renderRoomsByUserIdHandler'
import createRoomHandler from '../handlers/room/createRoomHandler'

export default (app: Express) => {
  app.get('/', homeHandler)
  app.get('/create-room', createRoomHandler)
  app.get('/users/rooms', renderRoomsByUserIdHandler)
}
