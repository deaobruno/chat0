import IAuthenticateUseCase from '../../application/useCases/auth/IAuthenticateUseCase'

type Request = {
  headers: {
    authorization: string
  }
}

export default (authenticateUseCase: IAuthenticateUseCase) => 
  async (request: Request) => {
    const { authorization } = request.headers

    return authenticateUseCase(authorization)
  }
