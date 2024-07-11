import ICreateMessageUseCase from '../../application/useCases/message/ICreateMessageUseCase'
import IEvent from './IEvent'

type Input = {
  roomId: string
  userId: string
  author: string
  text: string
  time: string
}

export default (createMessageUseCase: ICreateMessageUseCase): IEvent<Input> =>
  (input: Input) => createMessageUseCase(input)
