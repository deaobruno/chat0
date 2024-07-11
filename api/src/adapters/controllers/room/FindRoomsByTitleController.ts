import IFindRoomsByTitleUseCase from '../../../application/useCases/room/IFindRoomsByTitleUseCase'
import IRequest from '../IRequest'
import IResponse from '../IResponse'
import BaseError from '../../../application/errors/BaseError'

type Payload = {
  title: string
}

export default (findRoomsByTitleUseCase: IFindRoomsByTitleUseCase) =>
  async (request: IRequest<Payload>): Promise<IResponse> => {
    const { payload } = request
    const result = await findRoomsByTitleUseCase(payload)
    const { statusCode } = result as BaseError

    if (statusCode) return result as BaseError

    return {
      statusCode: 200,
      data: result,
    }
  }
