import { Server } from 'node:http'
import socketIo from 'socket.io'
import IEvents from '../events/IEvents'
import IGetRoomsByUserIdUseCase from '../useCases/room/IGetRoomsByUserIdUseCase'
import IAuthenticateUseCase from '../useCases/auth/IAuthenticateUseCase'
import BaseError from '../errors/BaseError'

type SocketConfig = {
  server: Server
  events: IEvents
  authenticateUseCase: IAuthenticateUseCase
  getRoomByUserIdUseCase: IGetRoomsByUserIdUseCase
}

type Message = {
  text: string
  time: string
  roomId: string
}

export default (config: SocketConfig) => {
  const {
    server,
    events,
    authenticateUseCase,
    getRoomByUserIdUseCase,
  } = config
  const io = new socketIo.Server(server)

  io
    .use(async (socket, next) => {
      const { token } = socket.handshake.auth

      if (!token)
        return next(Error('[Socket] Authentication is missing'))

      const userOrError = await authenticateUseCase(token)
      const { statusCode } = userOrError as BaseError
  
      if (statusCode) return next(userOrError as BaseError)

      socket.data.user = userOrError

      next()
    })
    .on('connection', async socket => {
      try {
        const { userId, username } = socket.data.user

        socket
          .on('newMessage', (message: Message) => {
            events.publish('newMessage', { userId, message, author: username })
            socket.to(message.roomId).emit('receivedMessage', message)
          })
          .on('getRoomsUpdate', async () => {
            const rooms = await getRoomByUserIdUseCase(userId)

            rooms.forEach(room => socket.join(room.roomId))
            socket.emit('updateRooms', rooms)
          })
      } catch (error) {
        io.close(() => console.log(`[Socket] ${error}`))
      }
    })
  }
