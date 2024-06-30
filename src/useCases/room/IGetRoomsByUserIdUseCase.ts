import IUseCase from '../IUseCase'
import Room from '../../entities/room/Room'

type IGetRoomsByUserIdUseCase = IUseCase<string, Room[]>

export default IGetRoomsByUserIdUseCase
