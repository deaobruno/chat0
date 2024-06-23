import IResponse from '../IResponse'

export default () => (): IResponse => {
  return {
    type: 'html',
    statusCode: 404,
    path: 'not-found.html',
  }
}
