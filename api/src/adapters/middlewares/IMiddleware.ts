import BaseError from '../../application/errors/BaseError'
import IRequest from '../controllers/IRequest'

type IMiddleware = (request: IRequest) => Promise<any | BaseError>

export default IMiddleware
