import { Repository } from 'typeorm'
import User from '../entity/user/User'

type IUserRepo = Repository<User> & {
  findOneByUserId(userId: string): Promise<User | null>
  findOneByEmail(email: string): Promise<User | null>
  findOneByUsername(username: string): Promise<User | null>
}

export default IUserRepo
