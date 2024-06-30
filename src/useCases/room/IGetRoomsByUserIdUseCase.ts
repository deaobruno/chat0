import IUseCase from '../IUseCase'
import Room from '../../entity/room/Room'

type IGetRoomsByUserIdUseCase = IUseCase<string, Room[]>

export default IGetRoomsByUserIdUseCase
