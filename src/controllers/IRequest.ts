import { IncomingHttpHeaders } from 'node:http'

type IRequest<Payload, Headers = IncomingHttpHeaders> = {
  payload: Payload
  headers: Headers
}

export default IRequest
