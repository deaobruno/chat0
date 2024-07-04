type BaseError = Error & { type: string, statusCode: number }

export default BaseError
