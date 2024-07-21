import IController from '../../adapters/controllers/IController'
import IMiddleware from '../../adapters/middlewares/IMiddleware'

type IRouter = {
  get: (url: string, ...handlers: [...IMiddleware[], IController]) => void
  post: (url: string, ...handlers: [...IMiddleware[], IController]) => void
  put: (url: string, ...handlers: [...IMiddleware[], IController]) => void
  delete: (url: string, ...handlers: [...IMiddleware[], IController]) => void
}

export default IRouter
