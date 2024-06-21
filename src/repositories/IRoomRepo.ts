import { Repository } from 'typeorm';
import { Room } from '../entity/room/Room'

type IRoomRepo = Repository<Room> & {
  findByTitle(title: string): Promise<Room[]>
  findOneByRoomId(roomId: string): Promise<Room | null>
}

export default IRoomRepo
