import MessageStatus from '../entities/message/MessageStatus'
import MessageType from '../entities/message/MessageType'
import IHash from '../hash/IHash'
import IMessageRepo from '../repositories/IMessageRepo'
import IEvent from './IEvent'

type NewMessageEventConfig = {
  hash: IHash
  messageRepo: IMessageRepo
}

type Message = {
  text: string
  time: string
  roomId: string
}

type NewMessageEventInput = {
  userId: string
  message: Message
  author: string
}

export default (config: NewMessageEventConfig): IEvent =>
  async (input: NewMessageEventInput) => {
    const {
      hash,
      messageRepo,
    } = config
    const { userId, message, author } = input
    const { roomId, text, time } = message
  
    await messageRepo.insert({
      messageId: hash.generateUuid(),
      roomId,
      userId,
      author,
      text,
      time: new Date(time),
      type: MessageType.TEXT,
      status: MessageStatus.SENT,
    })
  }
