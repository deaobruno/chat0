$('#create_room').submit(event => {
  const title = $('#title').val()
  const description = $('#description').val()
  const type = $('#type').val()
  
  if (!title || !description || !type) {
    event.preventDefault()
    
    return alert('title, description and type are needed')
  }
})
