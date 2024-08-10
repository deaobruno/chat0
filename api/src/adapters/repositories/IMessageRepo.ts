import Message from '../../domain/entities/message/Message'

type IMessageRepo = {
  create(message: Message): Promise<void>
  find(filters?: object, options?: object): Promise<Message[]>
  findByRoomId(roomId: string): Promise<Message[]>
  findLastMessagesByRoomId(roomId: string, skip?: number, take?: number): Promise<Message[]>
  findOne(filters: object): Promise<Message | null>  
  findOneByMessageId(messageId: string): Promise<Message | null>
  updateOne(message: Message, filters?: object): Promise<void>
  deleteOne(message: Message): Promise<void>
  deleteMany(filters: object): Promise<void>
}

export default IMessageRepo
