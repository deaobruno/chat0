import IUseCase from '../IUseCase'

type Input = {
  roomId: string
  userId: string
  author: string
  text: string
  time: string
}

type ICreateMessageUseCase = IUseCase<Input, void>

export default ICreateMessageUseCase
