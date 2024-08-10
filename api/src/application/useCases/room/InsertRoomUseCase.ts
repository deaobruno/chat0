import IInsertRoomUseCase from './IInsertRoomUseCase'
import IHash from '../../../infra/drivers/hash/IHash'
import RoomType from '../../../domain/entities/room/RoomType'
import RoomStatus from '../../../domain/entities/room/RoomStatus'
import UserRoomLevel from '../../../domain/entities/userRoom/UserRoomLevel'
import UserRoomStatus from '../../../domain/entities/userRoom/UserRoomStatus'
import IRoomRepo from '../../../adapters/repositories/IRoomRepo'
import IUserRoomRepo from '../../../adapters/repositories/IUserRoomRepo'
import BadRequestError from '../../errors/BadRequestError'
import Room from '../../../domain/entities/room/Room'
import UserRoom from '../../../domain/entities/userRoom/UserRoom'

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
    const room = new Room()
    
    room.roomId = roomId
    room.title = title
    room.description = description
    room.type = RoomType[type as keyof typeof RoomType]
    room.status = RoomStatus.ACTIVE

    await roomRepo.create(room)

    const userRoom = new UserRoom()

    userRoom.userRoomId = hash.generateUuid()
    userRoom.userId = userId
    userRoom.roomId = roomId
    userRoom.level = UserRoomLevel.ADMIN
    userRoom.status = UserRoomStatus.OK

    await userRoomRepo.create(userRoom)
  }
