import IUseCase from '../IUseCase'
import Room from '../../entities/room/Room'
import BaseError from '../../errors/BaseError'

type Input = {
  title: string
}

type Output = {
  rooms: Room[]
}

type IFindRoomsByTitleUseCase = IUseCase<Input, Promise<Output | BaseError>>

export default IFindRoomsByTitleUseCase
