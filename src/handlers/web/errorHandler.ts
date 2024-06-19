import { NextFunction, Request, Response } from 'express'
import BaseError from '../../errors/BaseError'
import InternalServerError from '../../errors/InternalServerError'

export default (error: BaseError, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = error

  if (!statusCode) error = new InternalServerError(message)

  console.log(error)

  res
    .status(statusCode)
    .render('error.html')
}
