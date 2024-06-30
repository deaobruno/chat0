import { DataSource } from 'typeorm'
import UserRoom from '../entity/userRoom/UserRoom'

export default (db: DataSource) => db
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
