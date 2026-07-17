import { onUnmounted, watch, type Ref } from 'vue'
export const useElementResize = (
  target: Ref<HTMLElement | null>,
  callback: (entry: ResizeObserverEntry) => void,
) => {
  let observer: ResizeObserver | null = null

  //监听目标容器resize并回调
  const observe = () => {
    if (!target.value) return

    observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        callback(entry)
      }
    })

    observer.observe(target.value)
  }

  //销毁监听
  const unobserve = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  //目标容器改变，重新监听
  watch(target, (newVal, oldVal) => {
    if (oldVal) unobserve()
    if (newVal) observe()
  })

  onUnmounted(() => {
    unobserve()
  })

  return {
    observe,
    unobserve,
  }
}
