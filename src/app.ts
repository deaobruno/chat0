import dependencies from './dependencies'

const {
  server,
  db,
  events,
  newMessageEvent
} = dependencies

;(async () => {
  try {
    events.subscribe('newMessage', newMessageEvent)
    await db.initialize()
    server.listen(8081, () => console.log('[Server] HTTP server started'))
  } catch (error) {
    console.log(error)
  }
})()
