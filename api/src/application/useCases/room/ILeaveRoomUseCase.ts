import IUseCase from '../IUseCase'
import User from '../../../domain/entities/user/User'
import BaseError from '../../errors/BaseError'

type Input = {
  user: User
  roomId: string
}

type ILeaveRoomUseCase = IUseCase<Input, Promise<void | BaseError>>

export default ILeaveRoomUseCase
