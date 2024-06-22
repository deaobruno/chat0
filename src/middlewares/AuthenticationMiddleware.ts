import { NextFunction, Request, Response } from 'express'
import { compare } from 'bcrypt'
import UnauthorizedError from '../errors/UnauthorizedError'
import IUserRepo from '../repositories/IUserRepo'

export default (userRepo: IUserRepo) => async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers

  if (!authorization) return next(UnauthorizedError('header["Authorization"] is missing'))

  const [type, base64] = authorization.split(' ')

  if (type !== 'Basic') return next(UnauthorizedError(`Invalid authentication type: ${type}`))
  if (!base64) return next(UnauthorizedError(`Invalid authentication: ${base64}`))

  const [username, password] = Buffer.from(base64, 'base64').toString().split(':')
  
  if (!username) return next(UnauthorizedError('Invalid "username"'))

  const user = await userRepo.findOneByUsername(username)

  if (!user) return next(UnauthorizedError('User not found'))
  if (!await compare(password, user.password)) return next(UnauthorizedError())
  if (!user.isLogged) return next(UnauthorizedError('User not logged'))

  req.body.user = user

  next()
}
