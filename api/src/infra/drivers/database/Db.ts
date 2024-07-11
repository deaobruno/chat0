import 'reflect-metadata'
import { DataSource } from 'typeorm'
import User from '../../../domain/entities/user/User'
import Room from '../../../domain/entities/room/Room'
import UserRoom from '../../../domain/entities/userRoom/UserRoom'
import Message from '../../../domain/entities/message/Message'

type DbConfig = {
  host: string
  port: number
  username?: string
  password?: string
  database: string
}

export default (config: DbConfig) => {
  const { host, port, username, password, database } = config
  const db = new DataSource({
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
  const start = async () => db.initialize()
  const stop = async () => db.destroy()

  return {
    db,
    start,
    stop,
  }
}
