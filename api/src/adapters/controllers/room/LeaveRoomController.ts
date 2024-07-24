import ILeaveRoomUseCase from '../../../application/useCases/room/ILeaveRoomUseCase'

export default (leaveRoomUseCase: ILeaveRoomUseCase) => {
  const statusCode = 204
  const handle = leaveRoomUseCase

  return {
    statusCode,
    handle,
  }
}
