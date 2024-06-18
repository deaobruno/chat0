import { NextFunction, Request, Response } from 'express'
import BadRequestError from '../../errors/BadRequestError'
import UnauthorizedError from '../../errors/UnauthorizedError'
import NotFoundError from '../../errors/NotFoundError'
import IUserRepo from '../../repositories/IUserRepo'
import IRoomRepo from '../../repositories/IRoomRepo'

export default (userRepo: IUserRepo, roomRepo: IRoomRepo) => async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.body

  if (!user_id) return next(new BadRequestError('Missing "user_id"'))

  const user = await userRepo.findOneById(user_id)

  if (!user) return next(new NotFoundError('User not found'))
  if (!user.logged) return next(new UnauthorizedError('User not logged'))

  user.logged = false

  await userRepo.updateOne(user_id, user)

  res.redirect('/')
}
