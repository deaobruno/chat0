export default (message = 'Internal Server Error') => 
  Object.assign(new Error(message), { type: 'json', statusCode: 500 })
