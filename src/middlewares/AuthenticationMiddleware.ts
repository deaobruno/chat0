import { compare } from 'bcrypt'
import UnauthorizedError from '../errors/UnauthorizedError'
import IUserRepo from '../repositories/IUserRepo'
import IRequest from '../controllers/IRequest'
import IResponse from '../controllers/IResponse'
import { User } from '../entity/user/User'
import IController from '../controllers/IController'

type Payload = {
  username: string
  password: string
  user: User
}

export default (userRepo: IUserRepo) => (controller: IController) =>
  async (request: IRequest<Payload>): Promise<IResponse> => {
    const { authorization } = request.headers

    if (!authorization) return UnauthorizedError('header["Authorization"] is missing')

    const [type, base64] = authorization.split(' ')

    if (type !== 'Basic') return UnauthorizedError(`Invalid authentication type: ${type}`)
    if (!base64) return UnauthorizedError(`Invalid authentication: ${base64}`)

    const [username, password] = Buffer.from(base64, 'base64').toString().split(':')
    
    if (!username) return UnauthorizedError('Invalid "username"')

    const user = await userRepo.findOneByUsername(username)

    if (!user) return UnauthorizedError('User not found')
    if (!await compare(password, user.password)) return UnauthorizedError()
    if (!user.isLogged) return UnauthorizedError('User not logged')

    request.payload.user = user

    return controller(request)
  }
