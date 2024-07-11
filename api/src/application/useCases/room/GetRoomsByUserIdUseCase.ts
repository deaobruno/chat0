import Room from '../../../domain/entities/room/Room'
import IUserRoomRepo from '../../../adapters/repositories/IUserRoomRepo'
import IRoomRepo from '../../../adapters/repositories/IRoomRepo'
import IMessageRepo from '../../../adapters/repositories/IMessageRepo'
import IGetRoomsByUserIdUseCase from './IGetRoomsByUserIdUseCase'

type UseCaseConfig = {
  userRoomRepo: IUserRoomRepo
  roomRepo: IRoomRepo
  messageRepo: IMessageRepo
}

export default (config: UseCaseConfig): IGetRoomsByUserIdUseCase =>
  async (userId: string): Promise<Room[]> => {
    const { userRoomRepo, roomRepo, messageRepo } = config
    const userRooms = await userRoomRepo.findByUserId(userId)
    const rooms: Room[] = []

    await Promise.all(userRooms.map(async userRoom => {
      const { roomId } = userRoom
      const room = await roomRepo.findOneByRoomId(roomId)

      if (!room) return

      ;(await messageRepo.findLastMessagesByRoomId(roomId))
        .reverse()
        .forEach(message => room.addMessage(message))

      rooms.push(room)
    }))

    return rooms
  }
