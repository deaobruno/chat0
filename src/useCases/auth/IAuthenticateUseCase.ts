import IUseCase from '../IUseCase'
import User from '../../entities/user/User'
import BaseError from '../../errors/BaseError'

type IAuthenticateUseCase = IUseCase<string, User | BaseError>

export default IAuthenticateUseCase
