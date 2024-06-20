import { NextFunction, Request, Response } from 'express'
import IUserRepo from '../../repositories/IUserRepo'

export default (userRepo: IUserRepo) => async (req: Request, res: Response, next: NextFunction) => {
  const { user: { userId} } = req.body

  await userRepo.update({ userId }, { isLogged: false })

  res
    .status(200)
    .send({ url: '/' })
}
