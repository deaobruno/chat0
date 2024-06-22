import { NextFunction, Request, Response } from 'express'
import { compare } from 'bcrypt'
import BadRequestError from '../../../errors/BadRequestError'
import UnauthorizedError from '../../../errors/UnauthorizedError'
import IUserRepo from '../../../repositories/IUserRepo'

export default (userRepo: IUserRepo) => async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body

  if (!username) return next(BadRequestError('Missing "username"'))
  if (!password) return next(BadRequestError('Missing "password"'))

  const user = await userRepo.findOneByUsername(username)

  if (!user) return next(UnauthorizedError())
  if (!await compare(password, user.password)) return next(UnauthorizedError())
  if (user.isLogged) return next(UnauthorizedError('User already logged'))

  const { userId } = user

  await userRepo.update({ userId }, { isLogged: true })

  res.send({ url: `http://localhost:8081/users/rooms` })
}
