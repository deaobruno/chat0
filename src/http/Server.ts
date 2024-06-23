import { STATUS_CODES, createServer } from 'node:http'
import { join } from 'node:path'
import express, { NextFunction, Request, Response, Router, json, urlencoded } from 'express'
import favicon from 'serve-favicon'
import ejs from 'ejs'
import Routes from '../routes/Routes'
import IController from '../controllers/IController'
import InternalServerError from '../errors/InternalServerError'

export default (dependencies: any) => {
  const { notFoundController, errorController } = dependencies
  const app = express()
  const expressRouter = Router()
  const jsonResponse = (res: Response, statusCode: number, data?: unknown) =>
    res.status(statusCode).json(data ?? { message: STATUS_CODES[statusCode] })
  const htmlResponse = (res: Response, statusCode: number, path: string, data?: object) =>
    res.status(statusCode).render(path, data)
  const handleRequest = (controller: IController) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { headers, body, params, query } = req
      const { type, statusCode, data, path } = await controller({
        headers,
        payload: { ...body, ...params, ...query },
      })

      switch (type) {
        case 'json':
          jsonResponse(res, statusCode, data)
          break;
      
        case 'html':
          if (!path) return next(InternalServerError('Controller is missing "path"'))

          htmlResponse(res, statusCode, path, data)
          break;

        default:
          next(InternalServerError('Controller is missing "type"'))
          break;
      }
    } catch (error) {
      next(error)
    }
  }
  const server = createServer(app)
  const publicDir = join(__dirname, '..', '..', 'public')
  const router = {
    get: (url: string, controller: IController) => expressRouter.get(url, handleRequest(controller)),
    post: (url: string, controller: IController) => expressRouter.post(url, handleRequest(controller)),
    put: (url: string, controller: IController) => expressRouter.put(url, handleRequest(controller)),
    delete: (url: string, controller: IController) => expressRouter.delete(url, handleRequest(controller)),
  }

  Routes(dependencies, router)

  app.use(json())
  app.use(urlencoded({ extended: false }))
  app.use(express.static(publicDir))
  app.use(favicon(join(publicDir, 'favicon.ico')))
  app.set('views', publicDir)
  app.engine('html', ejs.renderFile)
  app.set('view engine', 'html')
  app.use(expressRouter)
  app.use(handleRequest(notFoundController))
  app.use(handleRequest(errorController))

  return server
}
