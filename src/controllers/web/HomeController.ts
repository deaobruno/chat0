import IResponse from '../IResponse'

export default () => (): IResponse => {
  return {
    type: 'html',
    statusCode: 200,
    path: 'home.html',
  }
}
