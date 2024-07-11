import IUseCase from '../IUseCase'
import User from '../../../domain/entities/user/User'
import BaseError from '../../errors/BaseError'

type Input = {
  user: User
  title: string
  description: string
  type: string
}

type IInsertRoomUseCase = IUseCase<Input, Promise<void | BaseError>>

export default IInsertRoomUseCase
