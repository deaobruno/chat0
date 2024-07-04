import UnauthorizedError from '../errors/UnauthorizedError'
import IRequest from '../controllers/IRequest'
import IResponse from '../controllers/IResponse'
import User from '../entities/user/User'
import IController from '../controllers/IController'
import IAuthenticateUseCase from '../useCases/auth/IAuthenticateUseCase'
import BaseError from '../errors/BaseError'

type Payload = {
  username: string
  password: string
  user: User
}

export default (authenticateUseCase: IAuthenticateUseCase) => 
  (controller: IController) =>
  async (request: IRequest<Payload>): Promise<IResponse> => {
    const { authorization } = request.headers

    if (!authorization)
      return UnauthorizedError('header["Authorization"] is missing')

    const userOrError = await authenticateUseCase(authorization)
    const { statusCode } = userOrError as BaseError

    if (statusCode) return userOrError as BaseError

    request.payload.user = userOrError as User

    return controller(request)
  }
