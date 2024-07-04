import IInsertRoomUseCase from './IInsertRoomUseCase'
import IHash from '../../hash/IHash'
import User from '../../entities/user/User'
import RoomType from '../../entities/room/RoomType'
import RoomStatus from '../../entities/room/RoomStatus'
import UserRoomLevel from '../../entities/userRoom/UserRoomLevel'
import UserRoomStatus from '../../entities/userRoom/UserRoomStatus'
import IRoomRepo from '../../repositories/IRoomRepo'
import IUserRoomRepo from '../../repositories/IUserRoomRepo'
import BaseError from '../../errors/BaseError'
import BadRequestError from '../../errors/BadRequestError'

type UseCaseConfig = {
  hash: IHash
  roomRepo: IRoomRepo
  userRoomRepo: IUserRoomRepo
}

type Input = {
  user: User
  title: string
  description: string
  type: string
}

export default (config: UseCaseConfig): IInsertRoomUseCase =>
  async (input: Input): Promise<void | BaseError> => {
    const { hash, roomRepo, userRoomRepo } = config
    const { user, title, description, type } = input

    if (!title || typeof title !== 'string')
      return BadRequestError('Invalid "title"')
    if (!description || typeof description !== 'string')
      return BadRequestError('Invalid "description"')
    if (!type || !['DIRECT', 'GROUP'].includes(type))
      return BadRequestError('Invalid "type"')

    const { userId } = user
    const roomId = hash.generateUuid()

    await roomRepo.insert({
      roomId,
      title,
      description,
      type: RoomType[type as keyof typeof RoomType],
      status: RoomStatus.ACTIVE,
    })

    const userRoomId = hash.generateUuid()

    await userRoomRepo.insert({
      userRoomId,
      userId,
      roomId,
      level: UserRoomLevel.ADMIN,
      status: UserRoomStatus.OK,
    })  
  }
