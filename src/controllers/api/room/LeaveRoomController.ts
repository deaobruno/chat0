import IRoomRepo from '../../../repositories/IRoomRepo'
import IUserRoomRepo from '../../../repositories/IUserRoomRepo'
import IRequest from '../../IRequest'
import IResponse from '../../IResponse'
import BadRequestError from '../../../errors/BadRequestError'
import NotFoundError from '../../../errors/NotFoundError'
import User from '../../../entities/user/User'

type Payload = {
  user: User
  roomId: string
}

export default (roomRepo: IRoomRepo, userRoomRepo: IUserRoomRepo) =>
  async (request: IRequest<Payload>): Promise<IResponse> => {
    const { payload: { user: { userId }, roomId } } = request
    const room = await roomRepo.findOneByRoomId(roomId)

    if (!room) return NotFoundError('Room not found')
    if (!room.isActive) return BadRequestError('Invalid room')

    const userInRoom = await userRoomRepo
      .findOneByUserIdAndRoomId(userId, roomId)

    if (!userInRoom) return BadRequestError('User is not in room')

    await userRoomRepo.delete({ userId, roomId })

    return {
      type: 'json',
      statusCode: 204,
    }
  }
