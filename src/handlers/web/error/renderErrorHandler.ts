import { NextFunction, Request, Response } from 'express'
import BaseError from '../../../errors/BaseError'
import InternalServerError from '../../../errors/InternalServerError'

export default (error: BaseError, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = error

  if (!statusCode) error = InternalServerError(message)

  console.log('[Server]', error)

  res
    .status(statusCode)
    .send({
      error: message
    })
}
