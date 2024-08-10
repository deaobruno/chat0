import { config } from 'dotenv-safe'

config()

export default {
  http: {
    port: `${process.env.HTTP_PORT}`,
  },
}
