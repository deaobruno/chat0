const socket = io('http://localhost:8081', {
  auth: {
    token: auth
  }
})
const username = localStorage.getItem('uUn')

$('#new_room').click(event => {
  event.preventDefault()

  window.location.href = 'http://localhost:8081/create-room'
})

$('#logout').click(logout)

$(document).on('click', '.room', event => {
  event.preventDefault()

  const [, roomId] = $(event.target).closest('.room').attr('id').split('_')

  $('#active_room').val(roomId)
})

$('#new_message').submit(event => {
  event.preventDefault()

  const roomId = $('#active_room').val()
  const text = $('#text').val()

  if (!roomId) return alert('roomId is missing')
  if (!text) return alert('message is empty')

  const message = {
    roomId,
    text,
    time: new Date().toISOString(),
  }

  renderMessage(message)
  $('#text').val('')

  socket.emit('newMessage', message)
})

socket
  .on('receivedMessage', renderMessage)
  .on('updateRooms', rooms => {
    if (rooms.length <= 0) return

    $('#create_room').css('display', 'none')
    $('#rooms').empty()

    rooms.forEach(
      room => {
        const { roomId, title, messages } = room

        $('#rooms').append(`<div id="room_${roomId}" class="room">
          <div>${title}</div>
          <div class="last"></div>
          </div></br>`)

        if (messages.length > 0) 
          $(`#room_${roomId} .last`).html(`<strong>${messages[0].author}</strong>: ${room.messages[0].text}`)
      }
    )

    $('#rooms').css('display', 'block')
  })

function renderMessage(message) {
  const { roomId, text } = message
  const newMessage = `<strong>${username}</strong>: ${text}`

  $(`#room_${roomId} .last`).html(newMessage)

  if ($('#active_room').val() === roomId) $('#messages').append(newMessage)
}
