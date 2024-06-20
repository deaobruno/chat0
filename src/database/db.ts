import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '../entity/user/User'
import { Room } from '../entity/room/Room'
import { UserRoom } from '../entity/userRoom/UserRoom'
import { Message } from '../entity/message/Message'

type DbConfig = {
  host: string
  port: number
  username?: string
  password?: string
  database: string
}

export default (config: DbConfig) => {
  const { host, port, username, password, database } = config

  return new DataSource({
    type: 'mongodb',
    host,
    port,
    username,
    password,
    database,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    synchronize: false,
    entities: [User, Room, UserRoom, Message],
    migrations: [],
    subscribers: [],
  })
}
