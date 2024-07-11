export default (message = 'Internal Server Error') => 
  Object.assign(new Error(message), { statusCode: 500 })
