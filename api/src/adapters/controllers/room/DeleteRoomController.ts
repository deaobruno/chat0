import IRequest from '../IRequest'
import IResponse from '../IResponse'
import User from '../../../domain/entities/user/User'
import IDeleteRoomUseCase from '../../../application/useCases/room/IDeleteRoomUseCase'

type Payload = {
  user: User
  roomId: string
}

export default (deleteRoomUseCase: IDeleteRoomUseCase) =>
  async (request: IRequest<Payload>): Promise<IResponse> => {
    const { payload } = request
    const result = await deleteRoomUseCase(payload)

    if (result && result.statusCode) return result

    return {
      statusCode: 204,
    }
  }
