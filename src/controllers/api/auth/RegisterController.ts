import IRegisterUseCase from '../../../useCases/auth/IRegisterUseCase'
import IRequest from '../../IRequest'
import IResponse from '../../IResponse'
import BaseError from '../../../errors/BaseError'

type Payload = {
  email: string
  username: string
  password: string
}

export default (registerUseCase: IRegisterUseCase) =>
  async (request: IRequest<Payload>): Promise<IResponse> => {
    const { payload } = request
    const result = await registerUseCase(payload)
    const { statusCode } = result as BaseError

    if (statusCode) return result as BaseError

    return {
      type: 'json',
      statusCode: 201,
      data: result,
    }
  }
