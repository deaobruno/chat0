import { IncomingHttpHeaders } from 'node:http'

type IRequest<Payload = unknown, Headers = IncomingHttpHeaders> = {
  payload: Payload
  headers: Headers
}

export default IRequest
