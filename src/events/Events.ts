import EventEmitter from 'node:events'
import IEvent from './IEvent'

const eventEmitter = new EventEmitter()

export default () => {
  const subscribe = (topic: string, event: IEvent): void => {
    eventEmitter.on(topic, async (data?: object) => {
      try {
        await event(data)
      } catch (error) {
        console.log(`[${topic}]: ${error}`)
      }
    })
  }

  const publish = (topic: string, data?: unknown): void => {
    eventEmitter.emit(topic, data)
  }

  return {
    subscribe,
    publish,
  }
}
