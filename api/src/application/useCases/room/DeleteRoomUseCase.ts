import IJoinRoomUseCase from './IJoinRoomUseCase'
import IRoomRepo from '../../../adapters/repositories/IRoomRepo'
import IUserRoomRepo from '../../../adapters/repositories/IUserRoomRepo'
import IMessageRepo from '../../../adapters/repositories/IMessageRepo'
import BadRequestError from '../../errors/BadRequestError'
import NotFoundError from '../../errors/NotFoundError'
import ForbiddenError from '../../errors/ForbiddenError'

type UseCaseConfig = {
  roomRepo: IRoomRepo
  userRoomRepo: IUserRoomRepo
  messageRepo: IMessageRepo
}

export default (config: UseCaseConfig): IJoinRoomUseCase =>
  async input => {
    const { roomRepo, userRoomRepo, messageRepo } = config
    const { user: { userId }, roomId } = input
    const room = await roomRepo.findOneByRoomId(roomId)

    if (!room) return NotFoundError('Room not found')

    const userInRoom = await userRoomRepo
      .findOneByUserIdAndRoomId(userId, roomId)

    if (!userInRoom) return BadRequestError('User is not in room')
    if (!userInRoom.isAdmin || !userInRoom.isOk)
      return ForbiddenError('User lacks privilege')

    await messageRepo.deleteMany({ roomId })
    await userRoomRepo.deleteMany({ roomId })
    await roomRepo.deleteOne(room)
  }
