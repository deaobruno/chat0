type IResponse<Response = any> = {
  statusCode: number
  data?: Response
  path?: string
}

export default IResponse
