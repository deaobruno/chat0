import IRequest from '../IRequest'
import IResponse from '../IResponse'
import User from '../../../domain/entities/user/User'
import ILeaveRoomUseCase from '../../../application/useCases/room/ILeaveRoomUseCase'

type Payload = {
  user: User
  roomId: string
}

export default (leaveRoomUseCase: ILeaveRoomUseCase) =>
  async (request: IRequest<Payload>): Promise<IResponse> => {
    const { payload } = request
    const result = await leaveRoomUseCase(payload)

    if (result && result.statusCode) return result

    return {
      statusCode: 204,
    }
  }
