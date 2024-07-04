import IRequest from './IRequest'
import IResponse from './IResponse'

type IController<Payload = any, Response = any> = 
  (request: IRequest<Payload>) => 
    IResponse<Response> | Promise<IResponse<Response>>

export default IController
