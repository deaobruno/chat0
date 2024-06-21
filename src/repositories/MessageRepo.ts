import { DataSource } from 'typeorm'
import { Message } from '../entity/message/Message'

export default (db: DataSource) => db
  .getRepository(Message)
  .extend({
    findLastMessagesByRoomId(roomId: string, skip = 0) {
      const take = 10

      return this.find({ where: { roomId }, order: { time: 'desc' }, take, skip })
    },
    findByRoomId(roomId: string) {
      return this.find({ where: { roomId } })
    },
    findOneByMessageId(messageId: string) {
      return this.findOne({ where: { messageId } })
    },
  })
