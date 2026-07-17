type T = any
class SerialQueue {
  private queue: Array<() => Promise<void>> = []
  private isProcessing = false

  private processQueue = async () => {
    if (this.isProcessing || this.queue.length === 0) return
    this.isProcessing = true

    while (this.queue.length > 0) {
      const task = this.queue.shift()!
      try {
        await task()
      } catch (error) {
        console.error('Error processing task in serial queue:', error)
      }
    }

    this.isProcessing = false
  }

  enqueue = async (excuteFn: () => Promise<T>) => {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await excuteFn()
          resolve(result)
        } catch (e) {
          reject(e)
        }
      })
      this.processQueue()
    })
  }
}
export const serialQueue = new SerialQueue()
