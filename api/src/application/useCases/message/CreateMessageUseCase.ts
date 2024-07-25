import ICreateMessageUseCase from './ICreateMessageUseCase'
import IHash from '../../../infra/drivers/hash/IHash'
import IRoomRepo from '../../../adapters/repositories/IRoomRepo'
import IUserRoomRepo from '../../../adapters/repositories/IUserRoomRepo'
import IMessageRepo from '../../../adapters/repositories/IMessageRepo'
import MessageType from '../../../domain/entities/message/MessageType'
import MessageStatus from '../../../domain/entities/message/MessageStatus'
import Message from '../../../domain/entities/message/Message'

type UseCaseConfig = {
  hash: IHash
  roomRepo: IRoomRepo
  userRoomRepo: IUserRoomRepo
  messageRepo: IMessageRepo
}

export default (config: UseCaseConfig): ICreateMessageUseCase =>
  async input => {
    const {
      hash,
      roomRepo,
      userRoomRepo,
      messageRepo,
    } = config
    const { roomId, userId, author, text, time } = input
    const room = await roomRepo.findOneByRoomId(roomId)

    if (!room) return
    if (!room.isActive) return

    const userRoom = await userRoomRepo
      .findOneByUserIdAndRoomId(userId, roomId)

    if (!userRoom) return
    if (!userRoom.isOk) return

    const message = new Message()

    message.messageId = hash.generateUuid()
    message.roomId = roomId
    message.userId = userId
    message.author = author
    message.text = text
    message.time = new Date(time)
    message.type = MessageType.TEXT
    message.status = MessageStatus.SENT

    await messageRepo.create(message)
  }
