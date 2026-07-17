//全局事件总线

type EventCallBack<T = any> = (data: T) => void

class EventBus {
  private events = new Map<string, EventCallBack[]>()

  //subscirbe
  on<T = any>(event: string, callback: EventCallBack<T>) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(callback)
  }
  //publish
  emit<T = any>(event: string, args?: T) {
    const callbacks = this.events.get(event) || []
    callbacks.forEach((callback) => {
      callback(args)
    })
  }
  //clean
  off<T = any>(event: string, callback?: EventCallBack<T>) {
    if (!this.events.get(event)) return
    if (callback) {
      const callbacks = this.events.get(event) || []
      const i = callbacks.indexOf(callback)
      if (i !== -1) {
        callbacks.splice(i, 1)
      }
    } else {
      this.events.delete(event)
    }
  }
}

//提供事件实例
const globalEventBus = new EventBus()
export const eventBus = globalEventBus
//使用事件总线
/**export function provideEventBus() {
  const eventBus = new EventBus()
  provide(eventBusSympol, eventBus)
  return eventBus
}
export function useEventBus() {
  const eventBus = inject<EventBus>(eventBusSympol)
  if (!eventBus) {
    throw new Error('eventBus未提供')
  }
  return eventBus
}*/
