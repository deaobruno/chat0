import { DataSource } from 'typeorm'
import User from '../../domain/entities/user/User'

export default (db: DataSource) => db
  .getMongoRepository(User)
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
