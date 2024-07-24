import IUseCase from '../IUseCase'
import User from '../../../domain/entities/user/User'
import BaseError from '../../errors/BaseError'

type Output = {
  user: User
}

type IAuthenticateUseCase = IUseCase<string, Promise<Output | BaseError>>

export default IAuthenticateUseCase
