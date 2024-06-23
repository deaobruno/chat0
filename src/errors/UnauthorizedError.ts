export default (message = 'Unauthorized') => 
  Object.assign(new Error(message), { type: 'json', statusCode: 401 })
