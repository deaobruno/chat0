import { Entity, Column, ObjectIdColumn, PrimaryColumn } from 'typeorm'

@Entity()
export default class User {
  @ObjectIdColumn()
  _id: string

  @PrimaryColumn()
  userId: string

  @Column()
  email: string

  @Column()
  username: string

  @Column()
  password: string

  @Column()
  isLogged: boolean
}
