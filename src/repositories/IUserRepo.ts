type User = {
  user_id: string
  email: string
  username: string
  password: string
  logged: boolean
}

export default interface IUserRepo {
  create: (data: User) => Promise<void>
  find: (filters?: unknown) => Promise<User[]>
  findOne: (filters?: unknown) => Promise<User | null>
  findOneById: (id: string) => Promise<User | null>
  findOneByEmail: (email: string) => Promise<User | null>
  findOneByUsername: (username: string) => Promise<User | null>
  updateOne: (id: string, data: User) => Promise<void>
  updateMany: (filters: unknown, data: User) => Promise<void>
  deleteOne: (id: string) => Promise<void>
  deleteMany: (filters: unknown) => Promise<void>
}
