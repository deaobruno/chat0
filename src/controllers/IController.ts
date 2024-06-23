import IRequest from './IRequest'
import IResponse from './IResponse'

type IController = (request: IRequest<unknown>) => Promise<IResponse>

export default IController
