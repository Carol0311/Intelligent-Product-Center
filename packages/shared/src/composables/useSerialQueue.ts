export const useSerialQueue = () => {
  const queue: Array<() => Promise<void>> = []
  let isProcessing = false

  const processQueue = async () => {
    if (isProcessing || queue.length === 0) return
    isProcessing = true

    while (queue.length > 0) {
      const task = queue.shift()!
      try {
        await task()
      } catch (error) {
        console.error('Error processing task in serial queue:', error)
      }
    }

    isProcessing = false
  }

  const enqueue = (excuteFn: () => Promise<T>) => {
    return new Promise((resolve, reject) => {
      queue.push(async () => {
        try {
          const result = await excuteFn()
          resolve(result)
        } catch (e) {
          reject(e)
        }
      })
      processQueue().then(resolve).catch(reject)
    })
  }
}
