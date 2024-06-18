$('#register').submit(event => {
  const email = $('#register_email').val()
  const username = $('#register_username').val()
  const password = $('#register_password').val()
  
  if (!email || !username || !password) {
    event.preventDefault()
    
    return alert('email, username and password are needed')
  }
})

$('#login').submit(event => {
  const username = $('#login_username').val()
  const password = $('#login_password').val()
  
  if (!username || !password) {
    event.preventDefault()
    
    return alert('username and password are needed')
  }
})
