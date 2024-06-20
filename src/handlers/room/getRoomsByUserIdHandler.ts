import { NextFunction, Request, Response } from 'express'
import BadRequestError from '../../errors/BadRequestError'
import NotFoundError from '../../errors/NotFoundError'
import ForbiddenError from '../../errors/ForbiddenError'
import IUserRepo from '../../repositories/IUserRepo'
import IRoomRepo from '../../repositories/IRoomRepo'
import IUserRoomRepo from '../../repositories/IUserRoomRepo'

export default (userRepo: IUserRepo, roomRepo: IRoomRepo, userRoomRepo: IUserRoomRepo) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params

    if (!userId) return next(new BadRequestError('Invalid "userId"'))

    const user = await userRepo.findOneByUserId(userId)

    if (!user) return next(new NotFoundError('User not found'))
    if (!user.isLogged) return next(new ForbiddenError('User not logged'))

    const rooms = (await userRoomRepo.findByUserId(userId))
      .map(async userRoom => await roomRepo.findOneByRoomId(userRoom.roomId))

    res.render('user-rooms.html', { userId, rooms })
  }
