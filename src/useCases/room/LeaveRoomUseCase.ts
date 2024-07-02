import IJoinRoomUseCase from './IJoinRoomUseCase'
import User from '../../entities/user/User'
import IRoomRepo from '../../repositories/IRoomRepo'
import IUserRoomRepo from '../../repositories/IUserRoomRepo'
import BaseError from '../../errors/BaseError'
import BadRequestError from '../../errors/BadRequestError'
import NotFoundError from '../../errors/NotFoundError'

type UseCaseConfig = {
  roomRepo: IRoomRepo
  userRoomRepo: IUserRoomRepo
}

type Input = {
  user: User
  roomId: string
}

export default (config: UseCaseConfig): IJoinRoomUseCase =>
  async (input: Input): Promise<void | BaseError> => {
    const { roomRepo, userRoomRepo } = config
    const { user: { userId }, roomId } = input
    const room = await roomRepo.findOneByRoomId(roomId)

    if (!room) return NotFoundError('Room not found')
    if (!room.isActive) return BadRequestError('Invalid room')

    const userInRoom = await userRoomRepo
      .findOneByUserIdAndRoomId(userId, roomId)

    if (!userInRoom) return BadRequestError('User is not in room')

    await userRoomRepo.delete({ userId, roomId })

    const roomUsers = await userRoomRepo.findByRoomId(roomId)

    if (roomUsers.length < 1) await roomRepo.delete({ roomId })
  }
