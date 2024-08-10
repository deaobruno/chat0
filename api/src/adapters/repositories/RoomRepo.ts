import IDb from '../../infra/drivers/database/IDb'
import IRoomRepo from './IRoomRepo'
import Room from '../../domain/entities/room/Room'

export default (db: IDb<Room>, collection: string): IRoomRepo => {
  const create = async (room: Room) =>
    db.create(collection, room)
  const find = async (filters?: object, options?: object) =>
    db.find(collection, filters, options)
  const findByTitle = async (title: string, options?: object) =>
    db.find(collection, { title: new RegExp(`${title}`, 'i') }, options)
  const findOne = async (filters: object) =>
    db.findOne(collection, filters)
  const findOneByRoomId = async (roomId: string) =>
    db.findOne(collection, { roomId })
  const updateOne = async (room: Room, options?: object, { roomId } = room) =>
    db.updateOne(collection, room, { roomId }, options)
  const deleteOne = async (room: Room, options?: object, { roomId } = room) =>
    db.deleteOne(collection, { roomId }, options)

  return {
    create,
    find,
    findByTitle,
    findOne,
    findOneByRoomId,
    updateOne,
    deleteOne,
  }
}
