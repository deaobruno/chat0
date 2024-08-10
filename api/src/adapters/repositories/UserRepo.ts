import IDb from '../../infra/drivers/database/IDb'
import IUserRepo from './IUserRepo'
import User from '../../domain/entities/user/User'

export default (db: IDb<User>, collection: string): IUserRepo => {
  const create = async (user: User) =>
    db.create(collection, user)
  const find = async (filters?: object, options?: object) =>
    db.find(collection, filters, options)
  const findOne = async (filters: object) =>
    db.findOne(collection, filters)
  const findOneByUserId = async (userId: string) =>
    db.findOne(collection, { userId })
  const findOneByEmail = async (email: string) =>
    db.findOne(collection, { email })
  const findOneByUsername = async (username: string) =>
    db.findOne(collection, { username })
  const updateOne = async (user: User, options?: object, { userId } = user) =>
    db.updateOne(collection, user, { userId }, options)
  const deleteOne = async (user: User, options?: object, { userId } = user) =>
    db.deleteOne(collection, { userId }, options)

  return {
    create,
    find,
    findOne,
    findOneByUserId,
    findOneByEmail,
    findOneByUsername,
    updateOne,
    deleteOne,
  }
}
