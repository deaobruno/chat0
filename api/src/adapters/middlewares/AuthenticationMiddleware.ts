import UnauthorizedError from '../../application/errors/UnauthorizedError'
import IRequest from '../controllers/IRequest'
import User from '../../domain/entities/user/User'
import IAuthenticateUseCase from '../../application/useCases/auth/IAuthenticateUseCase'
import BaseError from '../../application/errors/BaseError'

type Payload = {
  username: string
  password: string
  user: User
}

export default (authenticateUseCase: IAuthenticateUseCase) => 
  async (request: IRequest<Payload>): Promise<any | BaseError> => {
    const { authorization } = request.headers

    if (!authorization)
      return UnauthorizedError('header["Authorization"] is missing')

    const userOrError = await authenticateUseCase(authorization)
    const { statusCode } = userOrError as BaseError

    if (statusCode) return userOrError

    return { user: userOrError }
  }
