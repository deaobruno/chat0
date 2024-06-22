export default (message = 'Conflict') => 
  Object.assign(new Error(message), { statusCode: 409 })
