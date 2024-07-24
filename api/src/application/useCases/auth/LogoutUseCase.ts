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
    const { userId } = user
  
    if (!user.isLogged) return UnauthorizedError('User not logged')

    await userRepo.update({ userId }, { isLogged: false })

    return { url: '/' }
  }
