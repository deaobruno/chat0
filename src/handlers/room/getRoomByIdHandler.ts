import { NextFunction, Request, Response } from 'express'
import BadRequestError from '../../errors/BadRequestError'
import UnauthorizedError from '../../errors/UnauthorizedError'
import NotFoundError from '../../errors/NotFoundError'
import ForbiddenError from '../../errors/ForbiddenError'
import IUserRepo from '../../repositories/IUserRepo'
import IRoomRepo from '../../repositories/IRoomRepo'
import IUserRoomRepo from '../../repositories/IUserRoomRepo'

export default (userRepo: IUserRepo, roomRepo: IRoomRepo, userRoomRepo: IUserRoomRepo) => async (req: Request, res: Response, next: NextFunction) => {
  const { roomId } = req.params
  const { u: username, p: password } = req.query

  if (!roomId) return next(new BadRequestError('Invalid "roomId"'))
  if (!username || typeof username !== 'string') return next(new BadRequestError('Invalid "username"'))
  if (!password || typeof password !== 'string') return next(new BadRequestError('Invalid "password"'))

  const user = await userRepo.findOneByUsername(username)

  if (!user) return next(new NotFoundError('User not found'))
  if (user.password !== password) return next(new UnauthorizedError())
  if (!user.isLogged) return next(new ForbiddenError('User not logged'))

  const { userId } = user
  const room = await roomRepo.findOneByRoomId(roomId)

  if (!room) return next(new NotFoundError('Room not found'))

  const userRoom = await userRoomRepo.findOneByUserIdAndRoomId(user.userId, roomId)

  if (!userRoom || !userRoom.isOk) return next(new UnauthorizedError('User is not allowed in room'))

  res.render('room.html', { userId, username })
}
