import IInsertRoomUseCase from '../../../useCases/room/IInsertRoomUseCase'
import User from '../../../entities/user/User'
import IRequest from '../../IRequest'
import IResponse from '../../IResponse'

type Payload = {
  user: User
  title: string
  description: string
  type: string
}

export default (insertRoomUseCase: IInsertRoomUseCase) =>
  async (request: IRequest<Payload>): Promise<IResponse> => {
    const { payload } = request
    const result = await insertRoomUseCase(payload)

    if (result && result.statusCode) return result

    return {
      type: 'json',
      statusCode: 201,
    }
  }
