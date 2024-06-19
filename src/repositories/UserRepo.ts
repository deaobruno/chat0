import { User } from '../entity/User'
import db from '../database/db'

export default db
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
