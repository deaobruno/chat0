import IUseCase from '../IUseCase'
import BaseError from '../../errors/BaseError'

type Input = {
  email: string
  username: string
  password: string
}

type Output = {
  url: string
}

type IRegisterUseCase = IUseCase<Input, Promise<Output | BaseError>>

export default IRegisterUseCase
