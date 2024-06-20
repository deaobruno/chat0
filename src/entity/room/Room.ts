import { Entity, Column, ObjectIdColumn, PrimaryColumn } from 'typeorm'
import RoomType from './RoomType'
import RoomStatus from './RoomStatus'
import { Message } from '../message/Message'

@Entity()
export class Room {
  @ObjectIdColumn()
  _id: string

  @PrimaryColumn()
  roomId: string

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  type: number

  @Column()
  status: number

  readonly messages: Message[] = []

  get isDirect() { return this.status === RoomType.DIRECT }

  get isGroup() { return this.status === RoomType.GROUP }

  get isActive() { return this.status === RoomStatus.ACTIVE }

  get isInEvaluation() { return this.status === RoomStatus.IN_EVALUATION }

  get isInactive() { return this.status === RoomStatus.INACTIVE }

  get isBanned() { return this.status === RoomStatus.BANNED }

  addMessage(message: Message): void {
    this.messages.push(message)
  }
}
