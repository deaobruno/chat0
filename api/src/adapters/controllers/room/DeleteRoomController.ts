import IDeleteRoomUseCase from '../../../application/useCases/room/IDeleteRoomUseCase'

export default (deleteRoomUseCase: IDeleteRoomUseCase) => {
  const statusCode = 204
  const handle = deleteRoomUseCase

  return {
    statusCode,
    handle,
  }
}
