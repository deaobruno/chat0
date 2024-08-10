import BaseError from '../../application/errors/BaseError'

type IMiddleware = (request: any) => Promise<any | BaseError>

export default IMiddleware
