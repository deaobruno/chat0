import dependenciesContainer from '../dependencies'
import IRouter from './IRouter'
import AuthRoutes from './AuthRoutes'
import RoomRoutes from './RoomRoutes'

export default (dependencies: typeof dependenciesContainer, router: IRouter) => {
  AuthRoutes(dependencies, router)
  RoomRoutes(dependencies, router)
}
