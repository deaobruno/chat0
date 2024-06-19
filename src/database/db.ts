import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '../entity/User'
import { Room } from '../entity/Room'
import { UserRoom } from '../entity/UserRoom'

export default new DataSource({
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    // username: "root",
    // password: "admin",
    database: 'chat0',
    useUnifiedTopology: true,
    useNewUrlParser: true,
    synchronize: false,
    logging: true,
    entities: [User, Room, UserRoom],
    migrations: [],
    subscribers: [],
})
