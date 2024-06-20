import { Repository } from 'typeorm';
import { Message } from '../entity/message/Message'

type IMessageRepo = Repository<Message> & {
  findByRoomId(roomId: string): Promise<Message[]>
  findOneByMessageId(messageId: string): Promise<Message | null>
}

export default IMessageRepo
