import crypto from 'node:crypto'

export default () => {
  const generateUuid = (): string => crypto.randomUUID()

  return {
    generateUuid,
  }
}
