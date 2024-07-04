import IJoinRoomUseCase from './IJoinRoomUseCase'
import User from '../../entities/user/User'
import IRoomRepo from '../../repositories/IRoomRepo'
import IUserRoomRepo from '../../repositories/IUserRoomRepo'
import IMessageRepo from '../../repositories/IMessageRepo'
import BaseError from '../../errors/BaseError'
import BadRequestError from '../../errors/BadRequestError'
import NotFoundError from '../../errors/NotFoundError'
import ForbiddenError from '../../errors/ForbiddenError'

type UseCaseConfig = {
  roomRepo: IRoomRepo
  userRoomRepo: IUserRoomRepo
  messageRepo: IMessageRepo
}

type Input = {
  user: User
  roomId: string
}

export default (config: UseCaseConfig): IJoinRoomUseCase =>
  async (input: Input): Promise<void | BaseError> => {
    const { roomRepo, userRoomRepo, messageRepo } = config
    const { user: { userId }, roomId } = input
    const room = await roomRepo.findOneByRoomId(roomId)

    if (!room) return NotFoundError('Room not found')

    const userInRoom = await userRoomRepo
      .findOneByUserIdAndRoomId(userId, roomId)

    if (!userInRoom) return BadRequestError('User is not in room')
    if (!userInRoom.isAdmin || !userInRoom.isOk)
      return ForbiddenError('User lacks privilege')

    await messageRepo.delete({ roomId })
    await userRoomRepo.delete({ roomId })
    await roomRepo.delete({ roomId })
  }
