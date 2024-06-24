import IController from '../controllers/IController'
import IRequest from '../controllers/IRequest'
import IResponse from '../controllers/IResponse'

type IMiddleware = (controller: IController) => (request: IRequest) => Promise<IResponse>

export default IMiddleware
