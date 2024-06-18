type User = {
  user_id: string
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
  room_id: string
  title: string
  users: { [user_id: string]: User }
  messages: Message[]
}

export default interface IRoomRepo {
  create: (data: Room) => Promise<void>
  find: (filters?: unknown) => Promise<Room[]>
  findByUserId: (user_id: string) => Promise<Room[]>
  findOne: (filters?: unknown) => Promise<Room | null>
  findOneById: (id: string) => Promise<Room | null>
  updateOne: (id: string, data: Room) => Promise<void>
  updateMany: (filters: unknown, data: Room) => Promise<void>
  deleteOne: (id: string) => Promise<void>
  deleteMany: (filters: unknown) => Promise<void>
}
