import IRegisterUseCase from './IRegisterUseCase'
import IHash from '../../hash/IHash'
import IEncryption from '../../encryption/IEncryption'
import IUserRepo from '../../repositories/IUserRepo'
import BaseError from '../../errors/BaseError'
import BadRequestError from '../../errors/BadRequestError'
import ConflictError from '../../errors/ConflictError'

type UseCaseConfig = {
  hash: IHash
  encryption: IEncryption
  userRepo: IUserRepo
}

type Input = {
  email: string
  username: string
  password: string
}

type Output = {
  url: string
}

export default (config: UseCaseConfig): IRegisterUseCase =>
  async (input: Input): Promise<Output | BaseError> => {
    const { hash, encryption, userRepo } = config
    const { email, username, password } = input
  
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

    return { url: '/users/rooms' }
  }
