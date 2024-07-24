import IFindRoomsByTitleUseCase from './IFindRoomsByTitleUseCase'
import IRoomRepo from '../../../adapters/repositories/IRoomRepo'
import BadRequestError from '../../errors/BadRequestError'

type UseCaseConfig = {
  roomRepo: IRoomRepo
}

export default (config: UseCaseConfig): IFindRoomsByTitleUseCase =>
  async input => {
    const { roomRepo } = config
    const { title } = input

    if (title.length < 3 || title.length > 50)
      return BadRequestError('Invalid title')

    const rooms = await roomRepo.findByTitle(title)

    return { rooms }
  }
