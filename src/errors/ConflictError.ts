export default (message = 'Conflict') => 
  Object.assign(new Error(message), { type: 'json', statusCode: 409 })
