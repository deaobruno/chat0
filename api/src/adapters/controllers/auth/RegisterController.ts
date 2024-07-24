import IRegisterUseCase from '../../../application/useCases/auth/IRegisterUseCase'

export default (registerUseCase: IRegisterUseCase) => {
  const statusCode = 201
  const handle = registerUseCase

  return {
    statusCode,
    handle,
  }
}
