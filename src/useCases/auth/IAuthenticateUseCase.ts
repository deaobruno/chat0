import IUseCase from '../IUseCase'
import { User } from '../../entity/user/User'
import BaseError from '../../errors/BaseError'

type IAuthenticateUseCase = IUseCase<string, User | BaseError>

export default IAuthenticateUseCase
