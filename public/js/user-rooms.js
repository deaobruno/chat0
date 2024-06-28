const renderMessage = (message) => {
  const { roomId, text, author } = message
  const newMessage = `<strong>${author}</strong>: ${text}</br>`

  $(`#room_${roomId} .last`).html(newMessage)

  if ($('#active_room').val() === roomId) $('#messages').append(newMessage)

  const { messages } = userRooms.find(room => room.roomId === roomId)

  messages.push(message)
}
const username = localStorage.getItem('uUn')
let userRooms = []
const socket = io('http://localhost:8081', {
  auth: {
    token: auth
  },
})
  .on('connect', () => setTimeout(() => socket.emit('getRoomsUpdate'), 100))
  .on('receivedMessage', renderMessage)
  .on('updateRooms', rooms => {
    userRooms = rooms

    $('#rooms').empty()

    if (rooms.length <= 0) {
      $('#rooms').css('display', 'none')
      $('#create_room').css('display', 'block')
      return
    }

    $('#create_room').css('display', 'none')

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

$('#search_room_title').on('keyup', event => {
  const search = $(event.target).val()

  if (search.length < 3 || search.length > 50) return

  request.get({
    url: `http://localhost:8081/rooms/title/${search}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    success: response => {
      $('#search_rooms').empty()
      response.rooms
        .forEach(room => 
          $('#search_rooms')
            .append(`<option id="room_option_${room.roomId}" class="room-option" value="${room.title}"></option>`))
    },
    error: response => console.log(response),
  })
})

$('#join_room').on('click', event => {
  const roomTitle = $('#search_room_title').val()
  const roomId = $(`#search_rooms option[value='${roomTitle}']`).attr('id')?.split('_')[2]

  if (!roomTitle || !roomId) return

  request.post({
    url: `http://localhost:8081/rooms/${roomId}/join`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    success: () => {
      $('#search_room_title').val('')
      socket.emit('getRoomsUpdate')
    },
    error: response => console.log(response),
  })
})

$('#new_room, #create_room').click(event => {
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
  $('#leave_active_room').css('display', 'block')
  $('#messages').empty()

  messages.forEach(message => 
    $('#messages').append(`<strong>${message.author}</strong>: ${message.text}</br>`))
})

$('#leave_active_room').on('click', event => {
  event.preventDefault()

  const roomId = $('#active_room').val()

  if (!roomId) return alert('roomId is missing')

  request.delete({
    url: `http://localhost:8081/rooms/${roomId}/leave`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    success: () => {
      $('#active_room').val('')
      $('#active_room_title').html('')
      $('#leave_active_room').css('display', 'none')
      $('#messages').empty()
      socket.emit('getRoomsUpdate')
    },
    error: response => console.log(response),
  })
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
