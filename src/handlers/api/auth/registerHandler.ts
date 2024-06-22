import { randomUUID } from 'node:crypto'
import { NextFunction, Request, Response } from 'express'
import { hash } from 'bcrypt'
import IUserRepo from '../../../repositories/IUserRepo'
import BadRequestError from '../../../errors/BadRequestError'
import ConflictError from '../../../errors/ConflictError'

export default (userRepo: IUserRepo) => async (req: Request, res: Response, next: NextFunction) => {
  const { email, username, password } = req.body

  if (!email) return next(BadRequestError('Missing "email"'))
  if (!username) return next(BadRequestError('Missing "username"'))
  if (!password) return next(BadRequestError('Missing "password"'))

  const userByEmail = await userRepo.findOneByEmail(email)

  if (userByEmail) return next(ConflictError('"email" already in use'))

  const userByUsername = await userRepo.findOneByUsername(username)

  if (userByUsername) return next(ConflictError('"username" already in use'))

  const userId = randomUUID()

  await userRepo.insert({
    userId,
    email,
    username,
    password: await hash(password, 10),
    isLogged: true
  })

  res
    .status(201)
    .send({ url: `/users/rooms` })
}
