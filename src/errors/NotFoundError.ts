export default (message = 'Not Found') => 
  Object.assign(new Error(message), { statusCode: 404 })
