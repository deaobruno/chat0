import IJoinRoomUseCase from '../../../application/useCases/room/IJoinRoomUseCase'

export default (joinRoomUseCase: IJoinRoomUseCase) => {
  const statusCode = 201
  const handle = joinRoomUseCase

  return {
    statusCode,
    handle,
  }
}
