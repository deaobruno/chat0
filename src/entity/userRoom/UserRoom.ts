import { Entity, Column, PrimaryColumn, ObjectIdColumn } from 'typeorm'
import UserRoomLevel from './UserRoomLevel'
import UserRoomStatus from './UserRoomStatus'

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
  level: number

  @Column()
  status: number

  get isRoot() { return this.status === UserRoomLevel.ROOT }

  get isAdmin() { return this.status === UserRoomLevel.ADMIN }

  get isUser() { return this.status === UserRoomLevel.USER }

  get isPending() { return this.status === UserRoomStatus.PENDING }

  get isOk() { return this.status === UserRoomStatus.OK }

  get isBlocked() { return this.status === UserRoomStatus.BLOCKED }

  get isBanned() { return this.status === UserRoomStatus.BANNED }
}
