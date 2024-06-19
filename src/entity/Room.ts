import { Entity, Column, ObjectIdColumn, PrimaryColumn } from 'typeorm'

enum RoomType {

}

enum RoomStatus {

}

type Message = {
  author: string
  text: string
}

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
  type: RoomType

  @Column()
  status: RoomStatus

  messages: Message[]
}
