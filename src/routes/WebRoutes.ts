import { Express } from 'express'
import renderHomeHandler from '../handlers/web/auth/renderHomeHandler'
import renderRoomsByUserIdHandler from '../handlers/web/user/renderRoomsByUserIdHandler'
import renderCreateRoomHandler from '../handlers/web/room/renderCreateRoomHandler'

export default (app: Express) => {
  app.get('/', renderHomeHandler)
  app.get('/create-room', renderCreateRoomHandler)
  app.get('/users/rooms', renderRoomsByUserIdHandler)
}
