import crypto from 'node:crypto'

export default () => {
  const generateUuid = crypto.randomUUID

  return {
    generateUuid,
  }
}
