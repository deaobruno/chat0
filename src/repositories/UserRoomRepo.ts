import { UserRoom } from '../entity/UserRoom'
import db from '../database/db'

export default db
  .getRepository(UserRoom)
  .extend({
    findByUserId(userId: string) {
      return this.find({ where: { userId } })
    },
    findByRoomId(roomId: string) {
      return this.find({ where: { roomId } })
    },
    findOneByUserRoomId(userRoomId: string) {
      return this.findOne({ where: { userRoomId } })
    },
    findOneByUserIdAndRoomId(userId: string, roomId: string) {
      return this.findOne({ where: { userId, roomId } })
    },
  })
