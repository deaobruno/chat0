import { NextFunction, Request, Response } from 'express'
import BadRequestError from '../../errors/BadRequestError'
import UnauthorizedError from '../../errors/UnauthorizedError'
import NotFoundError from '../../errors/NotFoundError'
import IUserRepo from '../../repositories/IUserRepo'
import IRoomRepo from '../../repositories/IRoomRepo'

export default (userRepo: IUserRepo, roomRepo: IRoomRepo) => async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body

  if (!userId) return next(new BadRequestError('Missing "userId"'))

  const user = await userRepo.findOneByUserId(userId)

  if (!user) return next(new NotFoundError('User not found'))
  if (!user.isLogged) return next(new UnauthorizedError('User not logged'))

  await userRepo.update({ userId }, { isLogged: false })

  res.redirect('/')
}
