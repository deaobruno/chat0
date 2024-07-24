import ILoginUseCase from '../../../application/useCases/auth/ILoginUseCase'

export default (loginUseCase: ILoginUseCase) => {
  const statusCode = 200
  const handle = loginUseCase

  return {
    statusCode,
    handle,
  }
}
