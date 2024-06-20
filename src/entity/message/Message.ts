import { Entity, Column, ObjectIdColumn, PrimaryColumn } from 'typeorm'
import MessageType from './MessageType'
import MessageStatus from './MessageStatus'

@Entity()
export class Message {
  @ObjectIdColumn()
  _id: string

  @PrimaryColumn()
  messageId: string

  @Column()
  roomId: string

  @Column()
  userId: string

  @Column()
  author: string

  @Column()
  text: string

  @Column()
  time: Date

  @Column()
  type: number

  @Column()
  status: number

  get isText() { return this.status === MessageType.TEXT }

  get isLink() { return this.status === MessageType.LINK }

  get isAudio() { return this.status === MessageType.AUDIO }

  get isImage() { return this.status === MessageType.IMAGE }

  get isVideo() { return this.status === MessageType.VIDEO }

  get isSent() { return this.status === MessageStatus.SENT }

  get isReceived() { return this.status === MessageStatus.RECEIVED }

  get isInEvaluation() { return this.status === MessageStatus.IN_EVALUATION }

  get isDeleted() { return this.status === MessageStatus.DELETED }
}
