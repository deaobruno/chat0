import IEvent from './IEvent'

type IEvents = {
  subscribe(topic: string, event: IEvent): void
  publish(topic: string, data?: unknown): void
}

export default IEvents
