import { NextFunction, Request, Response } from 'express'
import { compare } from 'bcrypt'
import BadRequestError from '../../errors/BadRequestError'
import UnauthorizedError from '../../errors/UnauthorizedError'
import IUserRepo from '../../repositories/IUserRepo'

export default (userRepo: IUserRepo) => async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body

  if (!username) return next(new BadRequestError('Missing "username"'))
  if (!password) return next(new BadRequestError('Missing "password"'))

  const user = await userRepo.findOneByUsername(username)

  if (!user) return next(new UnauthorizedError())
  if (!await compare(password, user.password)) return next(new UnauthorizedError())
  if (user.logged) return next(new UnauthorizedError('User already logged'))

  const { _id: user_id } = user

  user.logged = true

  await userRepo.updateOne(user_id, user)

  res.redirect(`/users/${user_id}/rooms`)
}
