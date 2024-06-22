import { NextFunction, Request, Response } from 'express'
import IRoomRepo from '../../../repositories/IRoomRepo'
import BadRequestError from '../../../errors/BadRequestError'

export default (roomRepo: IRoomRepo) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.params

    if (title.length < 3 || title.length > 50)
      return next(BadRequestError('Invalid title'))

    const rooms = await roomRepo.findByTitle(title)

    res
      .status(200)
      .send({ rooms })
  }
