import IUseCase from '../../application/useCases/IUseCase'

type IController = {
  statusCode: number
  handle: IUseCase
}

export default IController
