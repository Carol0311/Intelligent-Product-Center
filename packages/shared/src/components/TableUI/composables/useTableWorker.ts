import { ref } from 'vue'

export function useTableWorker() {
  const worker = ref<Worker | null>(null)
  const pendingRequests = new Map<string, (data: any) => void>()
  let requestId = 0

  // 动态创建 Worker URL，避免 Vite 解析问题
  // Table.vue
  const createWorker = () => {
    // 直接使用绝对路径，让 Vite 在构建时处理
    const workerUrl = new URL('@shared/components/TableUI/core/Table.Worker.ts', import.meta.url).href
    console.log('workerUrl', workerUrl)
    return new Worker(workerUrl, { type: 'module' })
  }

  const initWorker = () => {
    //创建worker
    //worker.value = createWorker()
    worker.value = new Worker(new URL('../core/Table.Worker.ts', import.meta.url), {
      type: 'module',
    })

    worker.value.onmessage = (e: MessageEvent) => {
      const { payload, requestId } = e.data

      if (requestId && pendingRequests.has(requestId)) {
        const resolve = pendingRequests.get(requestId)!
        resolve(payload)
        pendingRequests.delete(requestId)
      }
    }
  }

  const sendMessage = <T = any>(type: string, payload?: any): Promise<T> => {
    return new Promise((resolve) => {
      const id = String(requestId++)
      pendingRequests.set(id, resolve)

      worker.value?.postMessage({ type, payload, requestId: id })
    })
  }

  const destroy = () => {
    worker.value?.terminate()
    worker.value = null
    pendingRequests.clear()
  }

  return {
    initWorker,
    sendMessage,
    destroy,
    isReady: () => worker.value !== null,
  }
}
