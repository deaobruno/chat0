import { DataSource } from 'typeorm'
import { Room } from '../entity/room/Room'

export default (db: DataSource) => db
  .getRepository(Room)
  .extend({
    findOneByRoomId(roomId: string) {
      return this.findOne({ where: { roomId } })
    },
  })
