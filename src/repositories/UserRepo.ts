import { DataSource } from 'typeorm'
import { User } from '../entity/User'

export default (db: DataSource) => db
  .getRepository(User)
  .extend({
    findOneByUserId(userId: string) {
      return this.findOne({ where: { userId } })
    },
    findOneByEmail(email: string) {
      return this.findOne({ where: { email } })
    },
    findOneByUsername(username: string) {
      return this.findOne({ where: { username } })
    },
  })
