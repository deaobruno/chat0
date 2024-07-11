import { Repository } from 'typeorm';
import Message from '../../domain/entities/message/Message'

type IMessageRepo = Repository<Message> & {
  findLastMessagesByRoomId(roomId: string, skip?: number): Promise<Message[]>
  findByRoomId(roomId: string): Promise<Message[]>
  findOneByMessageId(messageId: string): Promise<Message | null>
}

export default IMessageRepo
