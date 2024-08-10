import IInsertRoomUseCase from '../../../application/useCases/room/IInsertRoomUseCase'

export default (insertRoomUseCase: IInsertRoomUseCase) => {
  const statusCode = 201
  const handle = insertRoomUseCase

  return {
    statusCode,
    handle,
  }
}
