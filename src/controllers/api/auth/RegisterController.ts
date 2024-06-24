import IEncryption from '../../../encryption/IEncryption'
import BadRequestError from '../../../errors/BadRequestError'
import ConflictError from '../../../errors/ConflictError'
import IHash from '../../../hash/IHash'
import IUserRepo from '../../../repositories/IUserRepo'
import IRequest from '../../IRequest'
import IResponse from '../../IResponse'

type Payload = {
  email: string
  username: string
  password: string
}

export default (hash: IHash, encryption: IEncryption, userRepo: IUserRepo) =>
  async (request: IRequest<Payload>): Promise<IResponse> => {
    const { payload: { email, username, password } } = request
  
    if (!email) return BadRequestError('Missing "email"')
    if (!username) return BadRequestError('Missing "username"')
    if (!password) return BadRequestError('Missing "password"')
  
    const userByEmail = await userRepo.findOneByEmail(email)
  
    if (userByEmail) return ConflictError('"email" already in use')
  
    const userByUsername = await userRepo.findOneByUsername(username)
  
    if (userByUsername) return ConflictError('"username" already in use')
  
    const userId = hash.generateUuid()
  
    await userRepo.insert({
      userId,
      email,
      username,
      password: await encryption.encrypt(password, 10),
      isLogged: true
    })

    return {
      type: 'json',
      statusCode: 201,
      data: { url: `http://localhost:8081/users/rooms` },
    }
  }
