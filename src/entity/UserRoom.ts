import { Entity, Column, PrimaryColumn, ObjectIdColumn } from 'typeorm'

enum UserRoomLevel {

}

enum UserRoomStatus {

}

@Entity()
export class UserRoom {
  @ObjectIdColumn()
  _id: string

  @PrimaryColumn()
  userRoomId: string

  @Column()
  userId: string

  @Column()
  roomId: string

  @Column()
  level: UserRoomLevel

  @Column()
  status: UserRoomStatus

  isPending: boolean
  isOk: boolean
  isBlocked: boolean
  isBanned: boolean
}
