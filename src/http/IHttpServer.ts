import { Server } from 'http'
import IRouter from '../routes/IRouter'

type IHttpServer = {
  server: Server
  router: IRouter
  start: () => void
  stop: () => void
}

export default IHttpServer
