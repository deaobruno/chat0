import { NextFunction, Request, Response } from 'express'
import UnauthorizedError from '../errors/UnauthorizedError'
import IUserRepo from '../repositories/IUserRepo'
import { compare } from 'bcrypt'

export default (userRepo: IUserRepo) => async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers

  if (!authorization) return next(new UnauthorizedError('header["Authorization"] is missing'))

  const [type, base64] = authorization.split(' ')

  if (type !== 'Basic') return next(new UnauthorizedError(`Invalid authentication type: ${type}`))
  if (!base64) return next(new UnauthorizedError(`Invalid authentication: ${base64}`))

  const [username, password] = Buffer.from(base64, 'base64').toString().split(':')
  
  if (!username) return next(new UnauthorizedError('Invalid "username"'))

  const user = await userRepo.findOneByUsername(username)

  if (!user) return next(new UnauthorizedError('User not found'))
  if (!compare(password, user.password)) return next(new UnauthorizedError())
  if (!user.isLogged) return next(new UnauthorizedError('User not logged'))

  req.body.user = user

  next()
}
