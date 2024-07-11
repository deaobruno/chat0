import { STATUS_CODES, createServer } from 'node:http'
import express, { NextFunction, Request, Response, Router, json, urlencoded } from 'express'
import cors from 'cors'
import IController from '../../../adapters/controllers/IController'
import InternalServerError from '../../../application/errors/InternalServerError'
import NotFoundError from '../../../application/errors/NotFoundError'
import BaseError from '../../../application/errors/BaseError'

export default (port: string | number) => {
  const app = express()
  const expressRouter = Router()
  const handleRequest = (controller: IController) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { headers, body, params, query } = req
        const response = await controller({
          headers,
          payload: { ...body, ...params, ...query },
        })
        const { statusCode, data } = response

        if (statusCode >= 400) return next(response)

        res
          .status(statusCode)
          .json(data ?? { message: STATUS_CODES[statusCode] })
      } catch (error) {
        next(error)
      }
    }
  const server = createServer(app)
  const router = {
    get: (url: string, controller: IController) =>
      expressRouter.get(url, handleRequest(controller)),
    post: (url: string, controller: IController) =>
      expressRouter.post(url, handleRequest(controller)),
    put: (url: string, controller: IController) =>
      expressRouter.put(url, handleRequest(controller)),
    delete: (url: string, controller: IController) =>
      expressRouter.delete(url, handleRequest(controller)),
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
