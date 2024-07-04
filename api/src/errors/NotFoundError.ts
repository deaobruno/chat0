export default (message = 'Not Found') => 
  Object.assign(new Error(message), { type: 'json', statusCode: 404 })
