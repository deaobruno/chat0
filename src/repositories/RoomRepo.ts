import IRoomRepo from './IRoomRepo'
import IUserRoomRepo from './IUserRoomRepo'

type User = {
  _id: string
  email: string
  username: string
  password: string
  logged: boolean
}

type Message = {
  author: string
  text: string
}

type Room = {
  _id: string
  title: string
  users: { [user_id: string]: User }
  messages: Message[]
}

export default (userRoomRepo: IUserRoomRepo): IRoomRepo => {
  const create = async (data: Room): Promise<void> => {}
  const find = async (filters?: unknown): Promise<Room[]> => {
    return []
  }
  const findByUserId = async (user_id: string): Promise<Room[]> => {
    return []
  }
  const findOne = async (filters?: unknown): Promise<Room | null> => {
    return null
  }
  const findOneById = async (id: string): Promise<Room | null> => {
    return null
  }
  const updateOne = async (id: string, data: Room): Promise<void> => {}
  const updateMany = async (filters: unknown, data: Room): Promise<void> => {}
  const deleteOne = async (id: string): Promise<void> => {}
  const deleteMany = async (filters: unknown): Promise<void> => {}

  return {
    create,
    find,
    findByUserId,
    findOne,
    findOneById,
    updateOne,
    updateMany,
    deleteOne,
    deleteMany,
  }
}
