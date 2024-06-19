import { Repository } from 'typeorm';
import { Room } from '../entity/Room'

type IRoomRepo = Repository<Room> & {
  // findByUserId(userId: string): Promise<Room[]>
  findOneByRoomId(roomId: string): Promise<Room | null>
}

export default IRoomRepo
