import IJoinRoomUseCase from './IJoinRoomUseCase'
import IHash from '../../../infra/drivers/hash/IHash'
import UserRoomLevel from '../../../domain/entities/userRoom/UserRoomLevel'
import UserRoomStatus from '../../../domain/entities/userRoom/UserRoomStatus'
import IRoomRepo from '../../../adapters/repositories/IRoomRepo'
import IUserRoomRepo from '../../../adapters/repositories/IUserRoomRepo'
import BadRequestError from '../../errors/BadRequestError'
import NotFoundError from '../../errors/NotFoundError'
import ConflictError from '../../errors/ConflictError'

type UseCaseConfig = {
  hash: IHash
  roomRepo: IRoomRepo
  userRoomRepo: IUserRoomRepo
}

export default (config: UseCaseConfig): IJoinRoomUseCase =>
  async input => {
    const { hash, roomRepo, userRoomRepo } = config
    const { user: { userId }, roomId } = input
    const room = await roomRepo.findOneByRoomId(roomId)

    if (!room) return NotFoundError('Room not found')
    if (!room.isActive) return BadRequestError('Invalid room')

    const userInRoom = await userRoomRepo
      .findOneByUserIdAndRoomId(userId, roomId)

    if (userInRoom) return ConflictError('User already in room')

    const userRoomId = hash.generateUuid()

    await userRoomRepo.insert({
      userRoomId,
      userId,
      roomId,
      level: UserRoomLevel.USER,
      status: UserRoomStatus.OK,
    })
  }
