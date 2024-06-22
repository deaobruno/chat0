import { Express } from 'express'
import RenderHomeHandler from '../handlers/web/auth/RenderHomeHandler'
import RenderRoomsByUserIdHandler from '../handlers/web/user/RenderRoomsByUserIdHandler'
import RenderCreateRoomHandler from '../handlers/web/room/RenderCreateRoomHandler'

export default (app: Express) => {
  app.get('/', RenderHomeHandler)
  app.get('/create-room', RenderCreateRoomHandler)
  app.get('/users/rooms', RenderRoomsByUserIdHandler)
}
