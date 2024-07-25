import 'reflect-metadata'
import { Document } from 'mongodb'
import { DataSource, DeleteOptions, EntityTarget, Filter, FindOptions, InsertOneOptions, UpdateFilter, UpdateOptions } from 'typeorm'
import User from '../../../domain/entities/user/User'
import Room from '../../../domain/entities/room/Room'
import UserRoom from '../../../domain/entities/userRoom/UserRoom'
import Message from '../../../domain/entities/message/Message'
import IDb from './IDb'

type DbConfig = {
  host: string
  port: number
  username?: string
  password?: string
  database: string
}

export default (config: DbConfig): IDb => {
  const { host, port, username, password, database } = config
  const db = new DataSource({
    type: 'mongodb',
    host,
    port,
    username,
    password,
    database,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    synchronize: false,
    entities: [User, Room, UserRoom, Message],
    migrations: [],
    subscribers: [],
  })
  const start = async () => {
    await db.initialize()
  }
  const stop = async () => db.destroy()
  const getEntity = (collection: string) => {
    switch (collection) {
      case 'user':
        return User

      case 'room':
        return Room

      case 'user_room':
        return UserRoom

      case 'message':
        return Message
    
      default:
        throw Error('Entity not found')
    }
  }
  const getRepository = (entity: EntityTarget<any>) => {
    return db.getMongoRepository(entity)
  }
  const create = async (
    collection: string,
    data: Document,
    options?: InsertOneOptions,
  ) => {
    await getRepository(getEntity(collection))
      .insertOne(data, options)
  }
  const find = async (
    collection: string,
    where?: Filter<Document>,
    options: FindOptions = {},
  ) => {
    const limit = options.limit ?? 10

    options.limit = limit;
    options.skip = (options.skip ?? 0) * limit

    return getRepository(getEntity(collection))
      .find({ where, ...options })
  }
  const findOne = async (collection: string, where?: Filter<Document>) => {
    return getRepository(getEntity(collection))
      .findOne({ where })
  }
  const updateOne = async (
    collection: string,
    data: UpdateFilter<Document>,
    filters: Filter<Document>,
    options?: UpdateOptions,
  ) => {
    await getRepository(getEntity(collection))
      .updateOne(filters, { $set: data }, options)
  }
  const updateMany = async (
    collection: string,
    data: UpdateFilter<Document>,
    filters: Filter<Document>,
    options?: UpdateOptions,
  ) => {
    await getRepository(getEntity(collection))
      .updateMany(filters, { $set: data }, options)
  }
  const deleteOne = async (
    collection: string,
    filters: Filter<Document>,
    options?: DeleteOptions,
  ) => {
    await getRepository(getEntity(collection))
      .deleteOne(filters,options)
  }
  const deleteMany = async (
    collection: string,
    filters: Filter<Document>,
    options?: DeleteOptions,
  ) => {
    await getRepository(getEntity(collection))
      .deleteMany(filters,options)
  }

  return {
    start,
    stop,
    create,
    find,
    findOne,
    updateOne,
    updateMany,
    deleteOne,
    deleteMany,
  }
}
