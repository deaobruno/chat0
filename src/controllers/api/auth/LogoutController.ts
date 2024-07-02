import User from '../../../entities/user/User'
import ILogoutUseCase from '../../../useCases/auth/ILogoutUseCase'
import IRequest from '../../IRequest'
import IResponse from '../../IResponse'
import BaseError from '../../../errors/BaseError'

type Payload = {
  user: User
}

export default (logoutUseCase: ILogoutUseCase) =>
  async (request: IRequest<Payload>): Promise<IResponse> => {
    const { payload } = request
    const result = await logoutUseCase(payload)
    const { statusCode } = result as BaseError

    if (statusCode) return result as BaseError

    return {
      type: 'json',
      statusCode: 200,
      data: result,
    }
  }
