export default (message = 'Bad Request') => 
  Object.assign(new Error(message), { statusCode: 400 })
