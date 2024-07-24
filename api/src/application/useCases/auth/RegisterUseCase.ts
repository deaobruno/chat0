import IRegisterUseCase from './IRegisterUseCase'
import IHash from '../../../infra/drivers/hash/IHash'
import IEncryption from '../../../infra/drivers/encryption/IEncryption'
import IUserRepo from '../../../adapters/repositories/IUserRepo'
import BadRequestError from '../../errors/BadRequestError'
import ConflictError from '../../errors/ConflictError'

type UseCaseConfig = {
  hash: IHash
  encryption: IEncryption
  userRepo: IUserRepo
}

export default (config: UseCaseConfig): IRegisterUseCase =>
  async input => {
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
