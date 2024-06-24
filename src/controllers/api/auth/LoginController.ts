import IEncryption from '../../../encryption/IEncryption'
import BadRequestError from '../../../errors/BadRequestError'
import UnauthorizedError from '../../../errors/UnauthorizedError'
import IUserRepo from '../../../repositories/IUserRepo'
import IRequest from '../../IRequest'
import IResponse from '../../IResponse'

type Payload = {
  username: string
  password: string
}

export default (userRepo: IUserRepo, encryption: IEncryption) =>
  async (request: IRequest<Payload>): Promise<IResponse> => {
    const { username, password } = request.payload

    if (!username) return BadRequestError('Missing "username"')
    if (!password) return BadRequestError('Missing "password"')

    const user = await userRepo.findOneByUsername(username)

    if (!user) return UnauthorizedError()
    if (!await encryption.validate(password, user.password))
      return UnauthorizedError()
    if (user.isLogged) return UnauthorizedError('User already logged')

    const { userId } = user

    await userRepo.update({ userId }, { isLogged: true })

    return {
      type: 'json',
      statusCode: 200,
      data: { url: `http://localhost:8081/users/rooms` },
    }
  }
