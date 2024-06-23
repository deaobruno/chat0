import IMiddleware from '../middlewares/IMiddleware'
import AuthRoutes from './AuthRoutes'
import RoomRoutes from './RoomRoutes'
import WebRoutes from './WebRoutes'
import IRouter from './IRouter'

export default (dependencies: any, router: IRouter) => {
  // AuthRoutes(config)
  // RoomRoutes(config)
  WebRoutes(dependencies, router)
}
