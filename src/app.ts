import dependencies from './dependencies'
import Routes from './routes/Routes'

const {
  httpServer,
  dbDriver,
  events,
  newMessageEvent
} = dependencies

;(async () => {
  try {
    events.subscribe('newMessage', newMessageEvent)
    Routes(dependencies, httpServer.router)
    await dbDriver.start()
    httpServer.start()
  } catch (error) {
    console.log(error)
  }
})()
