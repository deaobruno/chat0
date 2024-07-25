import { STATUS_CODES, createServer } from 'node:http'
import express, { NextFunction, Request, Response, Router, json, urlencoded } from 'express'
import cors from 'cors'
import IController from '../../../adapters/controllers/IController'
import InternalServerError from '../../../application/errors/InternalServerError'
import NotFoundError from '../../../application/errors/NotFoundError'
import BaseError from '../../../application/errors/BaseError'
import IMiddleware from '../../../adapters/middlewares/IMiddleware'

export default (port: string | number) => {
  const app = express()
  const expressRouter = Router()
  const handleMiddleware = (middleware: IMiddleware) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { headers, body, params, query } = req
        const result = await middleware({
          headers,
          payload: { ...body, ...params, ...query },
        })

        if (result && result.statusCode) return next(result)

        req.body = { ...req.body, ...result }

        next()
      } catch (error) {
        next(error)
      }
    }
  const handleController = (controller: IController) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { body, params, query } = req
        const { statusCode, handle } = controller
        const response = await handle({ ...body, ...params, ...query })

        if (response && response.statusCode) return next(response)

        res
          .status(statusCode)
          .json(response ?? { message: STATUS_CODES[statusCode] })
      } catch (error) {
        next(error)
      }
    }
  const server = createServer(app)
  const router = {
    get: (url: string, ...handlers: [...IMiddleware[], IController]) =>
      expressRouter.get(
        url,
        handlers.slice(0, -1).map(middleware => handleMiddleware(<IMiddleware>middleware)),
        handleController(<IController>handlers.pop()),
      ),
    post: (url: string, ...handlers: [...IMiddleware[], IController]) =>
      expressRouter.post(
        url,
        handlers.slice(0, -1).map(middleware => handleMiddleware(<IMiddleware>middleware)),
        handleController(<IController>handlers.pop()),
      ),
    put: (url: string, ...handlers: [...IMiddleware[], IController]) =>
      expressRouter.put(
        url,
        handlers.slice(0, -1).map(middleware => handleMiddleware(<IMiddleware>middleware)),
        handleController(<IController>handlers.pop()),
      ),
    delete: (url: string, ...handlers: [...IMiddleware[], IController]) =>
      expressRouter.delete(
        url,
        handlers.slice(0, -1).map(middleware => handleMiddleware(<IMiddleware>middleware)),
        handleController(<IController>handlers.pop()),
      ),
  }

  app.use(json())
  app.use(urlencoded({ extended: false }))
  app.use(cors())
  app.use(expressRouter)
  app.use((req: Request, res: Response, next: NextFunction) =>
    next(NotFoundError('Invalid URL')))
  app.use((
    error: BaseError,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const { statusCode, message } = error;

    if (!statusCode)
      error = InternalServerError(
        !message || message === '' ? undefined : message,
      );

    console.log({
      method: req.method.toLowerCase(),
      url: req.url,
      error,
    });

    res.status(error.statusCode).send({ error: error.message });
  })

  const start = () => {
    const httpServer = server
      .listen(port, () => {
        const serverAddress = httpServer.address()
        let address = 'localhost'

        if (
          serverAddress &&
          typeof serverAddress === 'object' &&
          serverAddress.address !== '::'
        )
          address = serverAddress.address

        console.log(
          `[Api] Express HTTP Server started: http://${address}:${port}.`,
        )
      })
      .on('close', () => console.log('[Api] Express HTTP Server stopped'))
      .on('error', (error) => console.log(error))
  }
  const stop = () => server.close()

  return {
    server,
    router,
    start,
    stop,
  }
}
