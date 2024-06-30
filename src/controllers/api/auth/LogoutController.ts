import User from '../../../entity/user/User'
import IUserRepo from '../../../repositories/IUserRepo'
import IRequest from '../../IRequest'
import IResponse from '../../IResponse'

type Payload = {
  user: User
}

export default (userRepo: IUserRepo) =>
  async (request: IRequest<Payload>): Promise<IResponse> => {
    const { user: { userId} } = request.payload

    await userRepo.update({ userId }, { isLogged: false })

    return {
      type: 'json',
      statusCode: 200,
      data: { url: `/` },
    }
  }
