import IUseCase from '../IUseCase'
import User from '../../entities/user/User'
import BaseError from '../../errors/BaseError'

type IAuthenticateUseCase = IUseCase<string, Promise<User | BaseError>>

export default IAuthenticateUseCase
