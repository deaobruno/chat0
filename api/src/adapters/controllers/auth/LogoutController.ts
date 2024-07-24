import ILogoutUseCase from '../../../application/useCases/auth/ILogoutUseCase'

export default (logoutUseCase: ILogoutUseCase) => {
  const statusCode = 200
  const handle = logoutUseCase

  return {
    statusCode,
    handle,
  }
}
