type IResponse<Response = any> = {
  statusCode: number
  data?: Response
}

export default IResponse
