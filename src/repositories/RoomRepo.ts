import { DataSource } from 'typeorm'
import { Room } from '../entity/room/Room'

export default (db: DataSource) => db
  .getRepository(Room)
  .extend({
    findByTitle(title: string) {
      return this.find({ where: { title: <any>new RegExp(`${title}`, 'i') } })
    },
    findOneByRoomId(roomId: string) {
      return this.findOne({ where: { roomId } })
    },
  })
