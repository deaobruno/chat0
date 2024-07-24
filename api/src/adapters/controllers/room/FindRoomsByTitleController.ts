import IFindRoomsByTitleUseCase from '../../../application/useCases/room/IFindRoomsByTitleUseCase'

export default (findRoomsByTitleUseCase: IFindRoomsByTitleUseCase) => {
  const statusCode = 200
  const handle = findRoomsByTitleUseCase

  return {
    statusCode,
    handle,
  }
}
