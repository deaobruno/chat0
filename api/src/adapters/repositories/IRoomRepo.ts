import Room from '../../domain/entities/room/Room'

type IRoomRepo = {
  create(room: Room): Promise<void>
  find(filters?: object, options?: object): Promise<Room[]>
  findByTitle(title: string, options?: object): Promise<Room[]>
  findOne(filters: object): Promise<Room | null>
  findOneByRoomId(roomId: string): Promise<Room | null>
  updateOne(room: Room, filters?: object): Promise<void>
  deleteOne(room: Room): Promise<void>
}

export default IRoomRepo
