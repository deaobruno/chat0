$('#logout').click(logout)

$('#create_room').submit(event => {
  event.preventDefault()

  const title = $('#title').val()
  const description = $('#description').val()
  const type = $('#type').val()
  
  if (!title || !description || !type) return alert('title, description and type are needed')

  request.post({
    url: 'http://localhost:8081/rooms',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    data: {
      title,
      description,
      type,
    },
    success: () => {
      $('#title').val('')
      $('#description').val('')
    },
    error: response => console.log(response),
  })
})
