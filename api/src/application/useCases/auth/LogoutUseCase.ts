import ILogoutUseCase from './ILogoutUseCase'
import IUserRepo from '../../../adapters/repositories/IUserRepo'
import UnauthorizedError from '../../errors/UnauthorizedError'

type UseCaseConfig = {
  userRepo: IUserRepo
}

export default (config: UseCaseConfig): ILogoutUseCase =>
  async input => {
    const { userRepo } = config
    const { user } = input
  
    if (!user.isLogged) return UnauthorizedError('User not logged')

    user.isLogged = false

    await userRepo.updateOne(user)

    return { url: '/' }
  }
