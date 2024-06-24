import IHash from '../../../hash/IHash'
import IRoomRepo from '../../../repositories/IRoomRepo'
import IUserRoomRepo from '../../../repositories/IUserRoomRepo'
import IRequest from '../../IRequest'
import IResponse from '../../IResponse'
import BadRequestError from '../../../errors/BadRequestError'
import { User } from '../../../entity/user/User'
import RoomType from '../../../entity/room/RoomType'
import RoomStatus from '../../../entity/room/RoomStatus'
import UserRoomLevel from '../../../entity/userRoom/UserRoomLevel'
import UserRoomStatus from '../../../entity/userRoom/UserRoomStatus'

type Payload = {
  user: User
  title: string
  description: string
  type: string
}

export default (hash: IHash, roomRepo: IRoomRepo, userRoomRepo: IUserRoomRepo) =>
  async (request: IRequest<Payload>): Promise<IResponse> => {
    const { payload: { user, title, description, type } } = request

    if (!title || typeof title !== 'string') return BadRequestError('Invalid "title"')
    if (!description || typeof description !== 'string') return BadRequestError('Invalid "description"')
    if (!type || !['DIRECT', 'GROUP'].includes(type)) return BadRequestError('Invalid "type"')

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

    return {
      type: 'json',
      statusCode: 201,
    }
  }
