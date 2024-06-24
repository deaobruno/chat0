import IRoomRepo from '../../../repositories/IRoomRepo'
import IRequest from '../../IRequest'
import IResponse from '../../IResponse'
import BadRequestError from '../../../errors/BadRequestError'

type Payload = {
  title: string
}

export default (roomRepo: IRoomRepo) =>
  async (request: IRequest<Payload>): Promise<IResponse> => {
    const { payload: { title } } = request

    if (title.length < 3 || title.length > 50)
      return BadRequestError('Invalid title')

    const rooms = await roomRepo.findByTitle(title)

    return {
      type: 'json',
      statusCode: 200,
      data: { rooms }
    }
  }
