const socket = io('http://localhost:8081')

$('#chat').submit(event => {
  event.preventDefault()

  const author = $('#username').val()
  const text = $('#text').val()

  if (author.length && text.length) {
    const message = {
      author,
      text,
    }

    renderMessage(message)

    socket.emit('newMessage', message)
  }
})

socket
  .on('previousMessages', messages => messages.forEach(renderMessage))
  .on('receivedMessage', renderMessage)

function renderMessage(message) {
  const { author, text } = message

  $('#messages').append(`<div class="message"><strong>${author}</strong>: ${text}</div>`)
}
