import { Repository } from 'typeorm'
import { User } from '../entity/User'

type IUserRepo = Repository<User> & {
  // findByRoomId(roomId: string): Promise<User[]>
  findOneByUserId(userId: string): Promise<User | null>
  findOneByEmail(email: string): Promise<User | null>
  findOneByUsername(username: string): Promise<User | null>
}

export default IUserRepo
