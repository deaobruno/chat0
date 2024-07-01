import BaseError from '../../../errors/BaseError'
import ILoginUseCase from '../../../useCases/auth/ILoginUseCase'
import IRequest from '../../IRequest'
import IResponse from '../../IResponse'

type Payload = {
  username: string
  password: string
}

export default (loginUseCase: ILoginUseCase) =>
  async (request: IRequest<Payload>): Promise<IResponse> => {
    const { payload } = request
    const result = await loginUseCase(payload)
    const { statusCode } = result as BaseError

    if (statusCode) return result as BaseError

    return {
      type: 'json',
      statusCode: 200,
      data: result,
    }
  }
