import { NextFunction, Request, Response } from 'express'
import BadRequestError from '../../errors/BadRequestError'
import UnauthorizedError from '../../errors/UnauthorizedError'
import NotFoundError from '../../errors/NotFoundError'
import ForbiddenError from '../../errors/ForbiddenError'
import IUserRepo from '../../repositories/IUserRepo'
import IRoomRepo from '../../repositories/IRoomRepo'

export default (userRepo: IUserRepo, roomRepo: IRoomRepo) => async (req: Request, res: Response, next: NextFunction) => {
  const { room_id } = req.params
  const { u: username, p: password } = req.query
  const uuidRegex = /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/i

  if (!room_id || !uuidRegex.test(room_id)) return next(new BadRequestError('Invalid "room_id"'))
  if (!username || typeof username !== 'string') return next(new BadRequestError('Invalid "username"'))
  if (!password || typeof password !== 'string') return next(new BadRequestError('Invalid "password"'))

  const user = await userRepo.findOneByUsername(username)

  if (!user) return next(new NotFoundError('User not found'))
  if (user.password !== password) return next(new UnauthorizedError())
  if (!user.logged) return next(new ForbiddenError('User not logged'))

  const room = await roomRepo.findOneById(room_id)

  if (!room) return next(new NotFoundError('Room not found'))

  room.users[user._id] = user

  res.render('room.html', { username })
}
