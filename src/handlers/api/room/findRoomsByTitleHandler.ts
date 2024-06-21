import { NextFunction, Request, Response } from 'express'
import IRoomRepo from '../../../repositories/IRoomRepo'

export default (roomRepo: IRoomRepo) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.params
    const rooms = await roomRepo.findByTitle(title)

    res
      .status(200)
      .send({ rooms })
  }
