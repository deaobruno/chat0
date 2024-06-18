import IUserRepo from './IUserRepo'
import IUserRoomRepo from './IUserRoomRepo'

type User = {
  _id: string
  email: string
  username: string
  password: string
  logged: boolean
}

export default (userRoomRepo: IUserRoomRepo): IUserRepo => {
  const create = async (): Promise<void> => {}
  const find = async (): Promise<User[]> => {
    return []
  }
  const findByRoomId = async (room_id: string): Promise<User[]> => {
    return []
  }
  const findOne = async (): Promise<User | null> => {
    return null
  }
  const findOneById = async (): Promise<User | null> => {
    return null
  }
  const findOneByEmail = async (): Promise<User | null> => {
    return null
  }
  const findOneByUsername = async (): Promise<User | null> => {
    return null
  }
  const updateOne = async (): Promise<void> => {}
  const updateMany = async (): Promise<void> => {}
  const deleteOne = async (): Promise<void> => {}
  const deleteMany = async (): Promise<void> => {}

  return {
    create,
    find,
    findByRoomId,
    findOne,
    findOneById,
    findOneByEmail,
    findOneByUsername,
    updateOne,
    updateMany,
    deleteOne,
    deleteMany,
  }
}
