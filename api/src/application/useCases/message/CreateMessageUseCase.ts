import ICreateMessageUseCase from './ICreateMessageUseCase'
import IHash from '../../../infra/drivers/hash/IHash'
import IRoomRepo from '../../../adapters/repositories/IRoomRepo'
import IUserRoomRepo from '../../../adapters/repositories/IUserRoomRepo'
import IMessageRepo from '../../../adapters/repositories/IMessageRepo'
import MessageType from '../../../domain/entities/message/MessageType'
import MessageStatus from '../../../domain/entities/message/MessageStatus'

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
