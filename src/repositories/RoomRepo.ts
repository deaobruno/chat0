import { Room } from '../entity/Room'
import db from '../database/db'

export default db
  .getRepository(Room)
  .extend({
    findOneByRoomId(roomId: string) {
      return this.findOne({ where: { roomId } })
    },
  })
