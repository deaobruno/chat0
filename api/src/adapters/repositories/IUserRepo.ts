import User from '../../domain/entities/user/User'

type IUserRepo = {
  create(user: User): Promise<void>
  find(filters?: object, options?: object): Promise<User[]>
  findOne(filters: object): Promise<User | null>
  findOneByUserId(userId: string): Promise<User | null>
  findOneByEmail(email: string): Promise<User | null>
  findOneByUsername(username: string): Promise<User | null>
  updateOne(user: User, filters?: object): Promise<void>
  deleteOne(user: User): Promise<void>
}

export default IUserRepo
