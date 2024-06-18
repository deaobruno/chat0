enum UserRoomStatus {

}

type UserRoom = {
  _id: string
  user_id: string
  room_id: string
  status: UserRoomStatus
}

export default interface IUserRoomRepo {
  create: (data: UserRoom) => Promise<void>
  find: (filters?: unknown) => Promise<UserRoom[]>
  findByUserId: (user_id: string) => Promise<UserRoom[]>
  findByRoomId: (room_id: string) => Promise<UserRoom[]>
  findOne: (filters?: unknown) => Promise<UserRoom | null>
  findOneById: (id: string) => Promise<UserRoom | null>
  updateOne: (id: string, data: UserRoom) => Promise<void>
  updateMany: (filters: unknown, data: UserRoom) => Promise<void>
  deleteOne: (id: string) => Promise<void>
  deleteMany: (filters: unknown) => Promise<void>
}
