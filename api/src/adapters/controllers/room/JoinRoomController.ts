import IRequest from '../IRequest'
import IResponse from '../IResponse'
import User from '../../../domain/entities/user/User'
import IJoinRoomUseCase from '../../../application/useCases/room/IJoinRoomUseCase'

type Payload = {
  user: User
  roomId: string
}

export default (joinRoomUseCase: IJoinRoomUseCase) =>
  async (request: IRequest<Payload>): Promise<IResponse> => {
    const { payload } = request
    const result = await joinRoomUseCase(payload)

    if (result && result.statusCode) return result

    return {
      statusCode: 201,
    }
  }
