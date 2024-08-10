export default (message = 'Unauthorized') => 
  Object.assign(new Error(message), { statusCode: 401 })
