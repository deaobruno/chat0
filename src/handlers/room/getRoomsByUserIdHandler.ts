import { NextFunction, Request, Response } from 'express'
import BadRequestError from '../../errors/BadRequestError'
import NotFoundError from '../../errors/NotFoundError'
import ForbiddenError from '../../errors/ForbiddenError'
import IUserRepo from '../../repositories/IUserRepo'
import IRoomRepo from '../../repositories/IRoomRepo'

export default (userRepo: IUserRepo, roomRepo: IRoomRepo) => async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.params
  const uuidRegex = /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/i

  if (!user_id || !uuidRegex.test(user_id)) return next(new BadRequestError('Invalid "user_id"'))

  const user = await userRepo.findOneById(user_id)

  if (!user) return next(new NotFoundError('User not found'))
  if (!user.logged) return next(new ForbiddenError('User not logged'))

  const rooms = await roomRepo.findByUserId(user_id)

  res.render('user-rooms.html', { rooms })
}
