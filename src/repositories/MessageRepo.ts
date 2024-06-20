import { DataSource } from 'typeorm'
import { Message } from '../entity/message/Message'

export default (db: DataSource) => db
  .getRepository(Message)
  .extend({
    findByRoomId(roomId: string) {
      return this.find({ where: { roomId } })
    },
    findOneByMessageId(messageId: string) {
      return this.findOne({ where: { messageId } })
    },
  })
