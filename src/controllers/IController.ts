import IRequest from './IRequest'
import IResponse from './IResponse'

type IController = (request: IRequest) => Promise<IResponse>

export default IController
