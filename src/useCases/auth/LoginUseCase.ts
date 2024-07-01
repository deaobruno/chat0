import ILoginUseCase from './ILoginUseCase'
import IEncryption from '../../encryption/IEncryption'
import IUserRepo from '../../repositories/IUserRepo'
import BaseError from '../../errors/BaseError'
import BadRequestError from '../../errors/BadRequestError'
import UnauthorizedError from '../../errors/UnauthorizedError'

type UseCaseConfig = {
  encryption: IEncryption
  userRepo: IUserRepo
}

type Input = {
  username: string
  password: string
}

type Output = {
  url: string
}

export default (config: UseCaseConfig): ILoginUseCase =>
  async (input: Input): Promise<Output | BaseError> => {
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

    return { url: `http://localhost:8081/users/rooms` }
  }
