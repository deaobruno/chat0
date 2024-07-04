import AuthRoutes from './AuthRoutes'
import RoomRoutes from './RoomRoutes'
import WebRoutes from './WebRoutes'
import IRouter from './IRouter'
import dependenciesContainer from '../dependencies'

export default (dependencies: typeof dependenciesContainer, router: IRouter) => {
  AuthRoutes(dependencies, router)
  RoomRoutes(dependencies, router)
  WebRoutes(dependencies, router)
}
