import { ref } from 'vue'
import { unCompressData } from '@shared/utils'

export function useTableWorker() {
  const worker = ref<Worker | null>(null)
  const pendingRequests = new Map<string, (data: any) => void>()
  let requestId = 0
  let _setDataCache: any

  const initWorker = () => {
    //创建worker
    worker.value = new Worker(new URL('../core/Table.Worker.ts', import.meta.url), {
      type: 'module',
    })

    worker.value.onmessage = async (e: MessageEvent) => {
      const { payload, requestId } = e.data

      if (payload && payload.action === 'SET_DATA_CACHE' && _setDataCache) {
        await new Promise((resolve) => setTimeout(resolve, 10))
        //const originalData = unCompressData(payload.cacheData)
        _setDataCache(payload.cacheKey, payload.cacheData)
      }

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

      const { setDataCache, ...rest } = payload || {}
      if (payload?.setDataCache) {
        _setDataCache = payload?.setDataCache
      }
      worker.value?.postMessage({ type, payload: rest, requestId: id })
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
