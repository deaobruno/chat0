import IInsertRoomUseCase from './IInsertRoomUseCase'
import IHash from '../../../infra/drivers/hash/IHash'
import RoomType from '../../../domain/entities/room/RoomType'
import RoomStatus from '../../../domain/entities/room/RoomStatus'
import UserRoomLevel from '../../../domain/entities/userRoom/UserRoomLevel'
import UserRoomStatus from '../../../domain/entities/userRoom/UserRoomStatus'
import IRoomRepo from '../../../adapters/repositories/IRoomRepo'
import IUserRoomRepo from '../../../adapters/repositories/IUserRoomRepo'
import BadRequestError from '../../errors/BadRequestError'

type UseCaseConfig = {
  hash: IHash
  roomRepo: IRoomRepo
  userRoomRepo: IUserRoomRepo
}

export default (config: UseCaseConfig): IInsertRoomUseCase =>
  async input => {
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
