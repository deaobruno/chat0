import BaseError from '../../errors/BaseError'
import IResponse from '../IResponse'
import InternalServerError from '../../errors/InternalServerError'

export default () => (error: BaseError): IResponse => {
  let { statusCode, message } = error

  if (!statusCode) error = InternalServerError(message)

  console.log('[Server]', error)

  return {
    type: 'html',
    statusCode,
    path: 'error.html',
  }
}
