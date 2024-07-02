import MessageStatus from '../entities/message/MessageStatus'
import MessageType from '../entities/message/MessageType'
import IHash from '../hash/IHash'
import IMessageRepo from '../repositories/IMessageRepo'
import IRoomRepo from '../repositories/IRoomRepo'
import IUserRoomRepo from '../repositories/IUserRoomRepo'
import IEvent from './IEvent'

type NewMessageEventConfig = {
  hash: IHash
  roomRepo: IRoomRepo
  userRoomRepo: IUserRoomRepo
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
      roomRepo,
      userRoomRepo,
      messageRepo,
    } = config
    const { userId, message, author } = input
    const { roomId, text, time } = message
    const room = await roomRepo.findOneByRoomId(roomId)

    if (!room) return
    if (!room.isActive) return

    const userRoom = await userRoomRepo
      .findOneByUserIdAndRoomId(userId, roomId)

    if (!userRoom) return
    if (!userRoom.isOk) return

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
