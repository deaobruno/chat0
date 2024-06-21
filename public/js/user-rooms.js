const socket = io('http://localhost:8081', {
  auth: {
    token: auth
  }
})
const username = localStorage.getItem('uUn')
let userRooms = []

$('#new_room').click(event => {
  event.preventDefault()

  window.location.href = 'http://localhost:8081/create-room'
})

$('#logout').click(logout)

$(document).on('click', '.room', event => {
  event.preventDefault()

  const [, roomId] = $(event.target).closest('.room').attr('id').split('_')
  const clickedRoom = userRooms.find(room => room.roomId === roomId)
  const { title, messages } = clickedRoom
  
  $('#active_room').val(roomId)
  $('#active_room_title').html(`<strong>${title}</strong>`)
  $('#messages').empty()

  messages.forEach(message => 
    $('#messages').append(`<strong>${message.author}</strong>: ${message.text}</br>`))
})

$('#new_message').submit(event => {
  event.preventDefault()

  const roomId = $('#active_room').val()
  const text = $('#text').val()

  if (!roomId) return alert('roomId is missing')
  if (!text) return alert('message is empty')

  const message = {
    author: username,
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

    userRooms = rooms

    $('#create_room').css('display', 'none')
    $('#rooms').empty()

    rooms.forEach(
      room => {
        const { roomId, title, messages } = room

        $('#rooms').append(`<div id="room_${roomId}" class="room">
          <div>${title}</div>
          <div class="last"></div>
          </div></br>`)

        if (messages.length <= 0) return

        const lastMessage = messages[messages.length - 1]

        $(`#room_${roomId} .last`).html(`<strong>${lastMessage.author}</strong>: ${lastMessage.text}`)
      }
    )

    $('#rooms').css('display', 'block')
  })

function renderMessage(message) {
  const { roomId, text, author } = message
  const newMessage = `<strong>${author}</strong>: ${text}</br>`

  $(`#room_${roomId} .last`).html(newMessage)

  if ($('#active_room').val() === roomId) $('#messages').append(newMessage)

  const { messages } = userRooms.find(room => room.roomId === roomId)

  messages.push(message)
}
