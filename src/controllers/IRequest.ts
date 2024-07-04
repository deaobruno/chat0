import { IncomingHttpHeaders } from 'node:http'

type IRequest<Payload = any, Headers = IncomingHttpHeaders> = {
  payload: Payload
  headers: Headers
}

export default IRequest
