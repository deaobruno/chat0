import IController from '../controllers/IController'

type IRouter = {
  get: (url: string, controller: IController) => void
  post: (url: string, controller: IController) => void
  put: (url: string, controller: IController) => void
  delete: (url: string, controller: IController) => void
}

export default IRouter
