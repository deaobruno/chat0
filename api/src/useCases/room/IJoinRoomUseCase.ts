import IUseCase from '../IUseCase'
import User from '../../entities/user/User'
import BaseError from '../../errors/BaseError'

type Input = {
  user: User
  roomId: string
}

type IJoinRoomUseCase = IUseCase<Input, Promise<void | BaseError>>

export default IJoinRoomUseCase
