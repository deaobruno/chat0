import ILoginUseCase from './ILoginUseCase'
import IEncryption from '../../../infra/drivers/encryption/IEncryption'
import IUserRepo from '../../../adapters/repositories/IUserRepo'
import BadRequestError from '../../errors/BadRequestError'
import UnauthorizedError from '../../errors/UnauthorizedError'

type UseCaseConfig = {
  encryption: IEncryption
  userRepo: IUserRepo
}

export default (config: UseCaseConfig): ILoginUseCase =>
  async input => {
    const { encryption, userRepo } = config
    const { username, password } = input

    if (!username) return BadRequestError('Missing "username"')
    if (!password) return BadRequestError('Missing "password"')

    const user = await userRepo.findOneByUsername(username)

    if (!user) return UnauthorizedError()
    if (!await encryption.validate(password, user.password))
      return UnauthorizedError()
    if (user.isLogged) return UnauthorizedError('User already logged')

    const { userId } = user

    await userRepo.update({ userId }, { isLogged: true })

    return { url: '/users/rooms' }
  }
