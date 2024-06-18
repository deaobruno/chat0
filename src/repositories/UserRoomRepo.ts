import IUserRoomRepo from "./IUserRoomRepo"

enum UserRoomStatus {

}

type UserRoom = {
  _id: string
  user_id: string
  room_id: string
  status: UserRoomStatus
}

export default (): IUserRoomRepo => {
  const create = async (data: UserRoom): Promise<void> => {}
  const find = async (filters?: unknown): Promise<UserRoom[]> => {
    return []
  }
  const findByUserId = async (user_id: string): Promise<UserRoom[]> => {
    return []
  }
  const findByRoomId = async (room_id: string): Promise<UserRoom[]> => {
    return []
  }
  const findOne = async (filters?: unknown): Promise<UserRoom | null> => {
    return null
  }
  const findOneById = async (id: string): Promise<UserRoom | null> => {
    return null
  }
  const updateOne = async (id: string, data: UserRoom): Promise<void> => {}
  const updateMany = async (filters: unknown, data: UserRoom): Promise<void> => {}
  const deleteOne = async (id: string): Promise<void> => {}
  const deleteMany = async (filters: unknown): Promise<void> => {}

  return {
    create,
    find,
    findByUserId,
    findByRoomId,
    findOne,
    findOneById,
    updateOne,
    updateMany,
    deleteOne,
    deleteMany,
  }
}
