import IFindRoomsByTitleUseCase from './IFindRoomsByTitleUseCase'
import Room from '../../../domain/entities/room/Room'
import IRoomRepo from '../../../adapters/repositories/IRoomRepo'
import BaseError from '../../errors/BaseError'
import BadRequestError from '../../errors/BadRequestError'

type UseCaseConfig = {
  roomRepo: IRoomRepo
}

type Input = {
  title: string
}

type Output = {
  rooms: Room[]
}

export default (config: UseCaseConfig): IFindRoomsByTitleUseCase =>
  async (input: Input): Promise<Output | BaseError> => {
    const { roomRepo } = config
    const { title } = input

    if (title.length < 3 || title.length > 50)
      return BadRequestError('Invalid title')

    const rooms = await roomRepo.findByTitle(title)

    return { rooms }
  }
