import { randomUUID } from 'node:crypto'
import { NextFunction, Request, Response } from 'express'
import IUserRoomRepo from '../../../repositories/IUserRoomRepo'
import UserRoomLevel from '../../../entity/userRoom/UserRoomLevel'
import UserRoomStatus from '../../../entity/userRoom/UserRoomStatus'

export default (userRoomRepo: IUserRoomRepo) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { user: { userId } } = req.body
    const { roomId } = req.params
    const userRoomId = randomUUID()

    await userRoomRepo.insert({
      userRoomId,
      userId,
      roomId,
      level: UserRoomLevel.USER,
      status: UserRoomStatus.OK,
    })

    res
      .status(201)
      .send()
  }
