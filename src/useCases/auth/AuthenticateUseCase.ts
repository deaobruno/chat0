import IEncryption from '../../encryption/IEncryption'
import User from '../../entities/user/User'
import BaseError from '../../errors/BaseError'
import UnauthorizedError from '../../errors/UnauthorizedError'
import IUserRepo from '../../repositories/IUserRepo'
import IAuthenticateUseCase from './IAuthenticateUseCase'

type UseCaseConfig = {
  encryption: IEncryption
  userRepo: IUserRepo
}

export default (config: UseCaseConfig): IAuthenticateUseCase =>
  async (authentication: string): Promise<User | BaseError> => {
    const { userRepo, encryption } = config
    const [type, base64] = authentication.split(' ')

    if (type !== 'Basic')
      return UnauthorizedError(`Invalid authentication type: ${type}`)
    if (!base64) return UnauthorizedError(`Invalid authentication: ${base64}`)

    const [username, password] = Buffer
      .from(base64, 'base64').toString().split(':')
    
    if (!username) return UnauthorizedError('Invalid "username"')

    const user = await userRepo.findOneByUsername(username)

    if (!user) return UnauthorizedError('User not found')
    if (!await encryption.validate(password, user.password))
      return UnauthorizedError()
    if (!user.isLogged) return UnauthorizedError('User not logged')

    return user
  }
