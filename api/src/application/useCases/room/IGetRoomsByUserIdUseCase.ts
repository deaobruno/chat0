import IUseCase from '../IUseCase'
import Room from '../../../domain/entities/room/Room'

type IGetRoomsByUserIdUseCase = IUseCase<string, Promise<Room[]>>

export default IGetRoomsByUserIdUseCase
