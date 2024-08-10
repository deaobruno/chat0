import IUseCase from '../IUseCase'
import User from '../../../domain/entities/user/User'
import BaseError from '../../errors/BaseError'

type Input = {
  user: User
}

type Output = {
  url: string
}

type ILogoutUseCase = IUseCase<Input, Promise<Output | BaseError>>

export default ILogoutUseCase
