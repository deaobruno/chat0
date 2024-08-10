import UserRoom from '../../domain/entities/userRoom/UserRoom'

type IUserRoomRepo = {
  create(user: UserRoom): Promise<void>
  find(filters?: object, options?: object): Promise<UserRoom[]>
  findByUserId: (userId: string, options?: object) => Promise<UserRoom[]>
  findByRoomId: (roomId: string, options?: object) => Promise<UserRoom[]>
  findOne(filters: object): Promise<UserRoom | null>
  findOneByUserRoomId: (userRoomId: string) => Promise<UserRoom | null>
  findOneByUserIdAndRoomId: (userId: string, roomId: string) => Promise<UserRoom | null>
  updateOne(user: UserRoom, filters?: object): Promise<void>
  deleteOne(user: UserRoom): Promise<void>
  deleteMany(filters: object): Promise<void>
}

export default IUserRoomRepo
