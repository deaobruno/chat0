import { randomUUID } from 'node:crypto'
import { NextFunction, Request, Response } from 'express'
import IRoomRepo from '../../../repositories/IRoomRepo'
import IUserRoomRepo from '../../../repositories/IUserRoomRepo'
import UserRoomLevel from '../../../entity/userRoom/UserRoomLevel'
import UserRoomStatus from '../../../entity/userRoom/UserRoomStatus'
import BadRequestError from '../../../errors/BadRequestError'
import NotFoundError from '../../../errors/NotFoundError'
import ConflictError from '../../../errors/ConflictError'

export default (roomRepo: IRoomRepo, userRoomRepo: IUserRoomRepo) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { user: { userId } } = req.body
    const { roomId } = req.params
    const room = await roomRepo.findOneByRoomId(roomId)

    if (!room) return next(NotFoundError('Room not found'))
    if (!room.isActive) return next(BadRequestError('Invalid room'))

    const userInRoom = await userRoomRepo.findOneByUserIdAndRoomId(userId, roomId)

    if (userInRoom) return ConflictError('User already in room')

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
