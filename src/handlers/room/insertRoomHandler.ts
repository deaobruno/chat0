import { randomUUID } from 'node:crypto'
import { NextFunction, Request, Response } from 'express'
import BadRequestError from '../../errors/BadRequestError'
import IRoomRepo from '../../repositories/IRoomRepo'
import IUserRepo from '../../repositories/IUserRepo'
import IUserRoomRepo from '../../repositories/IUserRoomRepo'

enum RoomType {
  'DIRECT',
  'GROUP',
}

enum RoomStatus {
  'ACTIVE',
  'IN_EVALUATION',
  'INACTIVE',
  'BANNED',
}

enum UserRoomLevel {
  'ROOT',
  'ADMIN',
  'USER'
}

enum UserRoomStatus {
  'PENDING',
  'OK',
  'BLOCKED',
  'BANNED',
}

export default (userRepo: IUserRepo, roomRepo: IRoomRepo, userRoomRepo: IUserRoomRepo) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, title, description, type } = req.body

    if (!title || typeof title !== 'string') return next(new BadRequestError('Invalid "title"'))
    if (!description || typeof description !== 'string') return next(new BadRequestError('Invalid "description"'))
    if (!type || !['DIRECT', 'GROUP'].includes(type)) return next(new BadRequestError('Invalid "type"'))

    const { userId } = user
    const roomId = randomUUID()

    await roomRepo.insert({
      roomId,
      title,
      description,
      type: <any>RoomType[type],
      status: RoomStatus.ACTIVE,
    })

    const userRoomId = randomUUID()

    await userRoomRepo.insert({
      userRoomId,
      userId,
      roomId,
      level: UserRoomLevel.ADMIN,
      status: UserRoomStatus.OK,
    })

    res
      .status(201)
      .send()
  }
