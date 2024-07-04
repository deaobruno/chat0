import IJoinRoomUseCase from './IJoinRoomUseCase'
import IHash from '../../hash/IHash'
import User from '../../entities/user/User'
import UserRoomLevel from '../../entities/userRoom/UserRoomLevel'
import UserRoomStatus from '../../entities/userRoom/UserRoomStatus'
import IRoomRepo from '../../repositories/IRoomRepo'
import IUserRoomRepo from '../../repositories/IUserRoomRepo'
import BaseError from '../../errors/BaseError'
import BadRequestError from '../../errors/BadRequestError'
import NotFoundError from '../../errors/NotFoundError'
import ConflictError from '../../errors/ConflictError'

type UseCaseConfig = {
  hash: IHash
  roomRepo: IRoomRepo
  userRoomRepo: IUserRoomRepo
}

type Input = {
  user: User
  roomId: string
}

export default (config: UseCaseConfig): IJoinRoomUseCase =>
  async (input: Input): Promise<void | BaseError> => {
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
