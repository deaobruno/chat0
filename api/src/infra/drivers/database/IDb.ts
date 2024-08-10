import { Document, UpdateFilter } from 'mongodb'

type IDb<Entity = any> = {
  start: () => Promise<void>
  stop: () => Promise<void>
  create: (
    collection: string,
    data: Entity,
    options?: object,
  ) => Promise<void>
  find: (
    collection: string,
    where?: object,
    options?: object,
  ) => Promise<Entity[]>
  findOne: (collection: string, where?: object) => Promise<Entity | null>
  updateOne: (
    collection: string,
    data: UpdateFilter<Document>,
    filters: object,
    options?: object,
  ) => Promise<void>
  updateMany: (
    collection: string,
    data: UpdateFilter<Document>,
    filters: object,
    options?: object,
  ) => Promise<void>
  deleteOne: (
    collection: string,
    filters: object,
    options?: object,
  ) => Promise<void>
  deleteMany: (
    collection: string,
    filters: object,
    options?: object,
  ) => Promise<void>
}

export default IDb
