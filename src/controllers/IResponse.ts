type IResponse<Response = any> = {
  type: string
  statusCode: number
  data?: Response
  path?: string
}

export default IResponse
