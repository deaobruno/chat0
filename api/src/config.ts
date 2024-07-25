import { config } from 'dotenv-safe'

config()

export default {
  http: {
    port: `${process.env.HTTP_PORT}`,
  },
  db: {
    mongo: {
      host: `${process.env.MONGO_DB_HOST}`,
      port: parseInt(`${process.env.MONGO_DB_PORT}`),
      database: `${process.env.MONGO_DB_DATABASE}`,
    },
    sources: {
      user: `${process.env.USER_SOURCE}`,
      room: `${process.env.ROOM_SOURCE}`,
      userRoom: `${process.env.USER_ROOM_SOURCE}`,
      message: `${process.env.MESSAGE_SOURCE}`,
    }
  },
}
