$('#register').submit(event => {
  event.preventDefault()

  const email = $('#register_email').val()
  const username = $('#register_username').val()
  const password = $('#register_password').val()

  if (!email || !username || !password) return alert('email, username and password are needed')

  request.post({
    url: 'http://localhost:8081/register',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      email,
      username,
      password,
    },
    success: response => {
      localStorage.setItem('bAb64', btoa(`${username}:${password}`))
      window.location.href = response.url
    },
    error: response => console.log(response),
  })
})

$('#login').submit(event => {
  event.preventDefault()

  const username = $('#login_username').val()
  const password = $('#login_password').val()

  if (!username || !password) return alert('username and password are needed')

  request.post({
    url: 'http://localhost:8081/login',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      username,
      password,
    },
    success: response => {
      localStorage.setItem('bAb64', btoa(`${username}:${password}`))
      window.location.href = response.url
    },
    error: response => console.log(response),
  })
})
