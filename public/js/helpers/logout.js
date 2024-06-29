const auth = `Basic ${localStorage.getItem('bAb64')}`
const logout = event => {
  event.preventDefault()

  request.post({
    url: 'http://localhost:8081/auth/logout',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth,
    },
    success: response => {
      localStorage.setItem('bAb64', '')
      window.location.href = response.url
    },
    error: response => console.log(response),
  })
}
