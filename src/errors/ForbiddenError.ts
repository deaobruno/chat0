export default (message = 'Forbidden') => 
  Object.assign(new Error(message), { type: 'json', statusCode: 403 })
