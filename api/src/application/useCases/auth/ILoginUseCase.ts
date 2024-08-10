import IUseCase from '../IUseCase'
import BaseError from '../../errors/BaseError'

type Input = {
  username: string
  password: string
}

type Output = {
  url: string
}

type ILoginUseCase = IUseCase<Input, Promise<Output | BaseError>>

export default ILoginUseCase
