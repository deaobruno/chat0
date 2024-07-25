import IDb from '../../infra/drivers/database/IDb'
import IUserRoomRepo from './IUserRoomRepo'
import UserRoom from '../../domain/entities/userRoom/UserRoom'

export default (db: IDb<UserRoom>, collection: string): IUserRoomRepo => {
  const create = async (user: UserRoom) =>
    db.create(collection, user)
  const find = async (filters?: object, options?: object) =>
    db.find(collection, filters, options)
  const findByUserId = async (userId: string, options?: object) =>
    db.find(collection, { userId }, options)
  const findByRoomId = async (roomId: string, options?: object) =>
    db.find(collection, { roomId }, options)
  const findOne = async (filters: object) =>
    db.findOne(collection, filters)
  const findOneByUserRoomId = async (userRoomId: string) =>
    db.findOne(collection, { userRoomId })
  const findOneByUserIdAndRoomId = async (userId: string, roomId: string) =>
    db.findOne(collection, { userId, roomId })
  const updateOne = async (user: UserRoom, options?: object, { userRoomId } = user) =>
    db.updateOne(collection, user, { userRoomId }, options)
  const deleteOne = async (user: UserRoom, options?: object, { userRoomId } = user) =>
    db.deleteOne(collection, { userRoomId }, options)
  const deleteMany = async (filters: object) =>
    db.deleteMany(collection, filters)

  return {
    create,
    find,
    findByUserId,
    findByRoomId,
    findOne,
    findOneByUserRoomId,
    findOneByUserIdAndRoomId,
    updateOne,
    deleteOne,
    deleteMany,
  }
}
