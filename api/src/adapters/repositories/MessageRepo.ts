import IDb from '../../infra/drivers/database/IDb'
import IMessageRepo from './IMessageRepo'
import Message from '../../domain/entities/message/Message'

export default (db: IDb<Message>, collection: string): IMessageRepo => {
  const create = async (message: Message) =>
    db.create(collection, message)
  const find = async (filters?: object, options?: object) =>
    db.find(collection, filters, options)
  const findByRoomId = async (roomId: string, options?: object) =>
    db.find(collection, { roomId }, options)
  const findLastMessagesByRoomId = async (roomId: string, skip = 0, take = 10) =>
    db.find(collection, { roomId }, { order: { time: 'desc' }, skip, take })
  const findOne = async (filters: object) =>
    db.findOne(collection, filters)
  const findOneByMessageId = async (messageId: string) =>
    db.findOne(collection, { messageId })
  const updateOne = async (message: Message, options?: object, { messageId } = message) =>
    db.updateOne(collection, message, { messageId }, options)
  const deleteOne = async (message: Message, options?: object, { messageId } = message) =>
    db.deleteOne(collection, { messageId }, options)
  const deleteMany = async (filters: object) =>
    db.deleteMany(collection, filters)

  return {
    create,
    find,
    findByRoomId,
    findLastMessagesByRoomId,
    findOne,
    findOneByMessageId,
    updateOne,
    deleteOne,
    deleteMany,
  }
}
