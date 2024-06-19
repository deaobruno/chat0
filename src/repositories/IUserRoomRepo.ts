import { Repository } from 'typeorm'
import { UserRoom } from '../entity/UserRoom'

type IUserRoomRepo = Repository<UserRoom> &  {
  findByUserId: (userId: string) => Promise<UserRoom[]>
  findByRoomId: (roomId: string) => Promise<UserRoom[]>
  findOneByUserRoomId: (userRoomId: string) => Promise<UserRoom | null>
  findOneByUserIdAndRoomId: (userId: string, roomId: string) => Promise<UserRoom | null>
}

export default IUserRoomRepo
