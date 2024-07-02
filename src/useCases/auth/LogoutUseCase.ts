import ILogoutUseCase from './ILogoutUseCase'
import IUserRepo from '../../repositories/IUserRepo'
import User from '../../entities/user/User'
import BaseError from '../../errors/BaseError'
import UnauthorizedError from '../../errors/UnauthorizedError'

type UseCaseConfig = {
  userRepo: IUserRepo
}

type Input = {
  user: User
}

type Output = {
  url: string
}

export default (config: UseCaseConfig): ILogoutUseCase =>
  async (input: Input): Promise<Output | BaseError> => {
    const { userRepo } = config
    const { user } = input
    const { userId } = user
  
    if (!user.isLogged) return UnauthorizedError('User not logged')

    await userRepo.update({ userId }, { isLogged: false })

    return { url: '/' }
  }
