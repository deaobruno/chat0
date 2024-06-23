export default (message = 'Bad Request') => 
  Object.assign(new Error(message), { type: 'json', statusCode: 400 })
