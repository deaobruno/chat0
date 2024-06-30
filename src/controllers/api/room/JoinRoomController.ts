import IHash from '../../../hash/IHash'
import IRoomRepo from '../../../repositories/IRoomRepo'
import IUserRoomRepo from '../../../repositories/IUserRoomRepo'
import IRequest from '../../IRequest'
import IResponse from '../../IResponse'
import BadRequestError from '../../../errors/BadRequestError'
import NotFoundError from '../../../errors/NotFoundError'
import ConflictError from '../../../errors/ConflictError'
import User from '../../../entities/user/User'
import UserRoomLevel from '../../../entities/userRoom/UserRoomLevel'
import UserRoomStatus from '../../../entities/userRoom/UserRoomStatus'

type Payload = {
  user: User
  roomId: string
}

export default (hash: IHash, roomRepo: IRoomRepo, userRoomRepo: IUserRoomRepo) =>
  async (request: IRequest<Payload>): Promise<IResponse> => {
    const { payload: { user: { userId }, roomId } } = request
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

    return {
      type: 'json',
      statusCode: 201,
    }
  }
