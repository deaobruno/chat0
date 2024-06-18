import { NextFunction, Request, Response } from 'express'
import { randomUUID } from 'crypto'
import { hash } from 'bcrypt'
import IUserRepo from '../../repositories/IUserRepo'
import BadRequestError from '../../errors/BadRequestError'
import ConflictError from '../../errors/ConflictError'

export default (userRepo: IUserRepo) => async (req: Request, res: Response, next: NextFunction) => {
  const { email, username, password } = req.body

  if (!email) return next(new BadRequestError('Missing "email"'))
  if (!username) return next(new BadRequestError('Missing "username"'))
  if (!password) return next(new BadRequestError('Missing "password"'))

  const userByEmail = await userRepo.findOneByEmail(email)

  if (userByEmail) return next(new ConflictError('"email" already in use'))

  const userByUsername = await userRepo.findOneByUsername(username)

  if (userByUsername) return next(new ConflictError('"username" already in use'))

  const user_id = randomUUID()

  await userRepo.create({
    user_id,
    email,
    username,
    password: await hash(password, 10),
    logged: true
  })

  res.redirect(`/users/${user_id}/rooms`)
}