export default (message = 'Forbidden') => 
  Object.assign(new Error(message), { statusCode: 403 })
