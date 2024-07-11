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
  },
}
