import { ref, onMounted, onUnmounted } from 'vue'
/**为目标容器处理滚动事件*/
export const useScrollPosition = (container?: HTMLElement) => {
  const curContainer = ref<HTMLElement | Window>(window)
  const scrollX = ref(0)
  const scrollY = ref(0)
  const scrollDirection = ref<'left' | 'right' | 'down' | 'up' | null>(null)

  const setContainer = (newContainer: HTMLElement) => {
    curContainer.value.removeEventListener('scroll', updateScrollPos)
    curContainer.value = newContainer
    newContainer.addEventListener('scroll', updateScrollPos, { passive: true })
    console.log('新容器已设置', newContainer)
  }
  const resetToWindow = () => {
    curContainer.value.removeEventListener('scroll', updateScrollPos)
    curContainer.value = window
    window.addEventListener('scroll', updateScrollPos, { passive: true })
  }
  const updateScrollPos = () => {
    const preY = scrollY.value
    const preX = scrollX.value
    if (curContainer.value instanceof Window) {
      scrollX.value = window?.scrollX
      scrollY.value = window?.scrollY
    } else {
      scrollX.value = curContainer.value.scrollLeft
      scrollY.value = curContainer.value.scrollTop
    }

    //纵向滚动
    if (scrollY.value > preY) {
      scrollDirection.value = 'down'
    } else if (scrollY.value < preY) {
      scrollDirection.value = 'up'
    } else {
      //横向滚动
      if (scrollX.value > preX) {
        scrollDirection.value = 'right'
      } else if (scrollX.value < preX) {
        scrollDirection.value = 'left'
      }
    }
  }
  //纵向滚动是否到达某个位置
  const isScrollYTo = (y: number) => scrollY.value >= y
  //横向滚动是否到达某个位置
  const isScrollXTo = (x: number) => scrollX.value >= x
  //是否在视区内
  const isInViewport = (ele: HTMLElement) => {
    const rect = ele.getBoundingClientRect()
    let [width, height] = [0, 0]
    if (curContainer.value instanceof Window) {
      width = curContainer.value.innerWidth
      height = curContainer.value.innerHeight
    } else {
      width = curContainer.value.clientWidth
      height = curContainer.value.clientHeight
    }
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= height && rect.right <= width
  }
  onMounted(() => {
    if (container) {
      setContainer(container)
    } else {
      window.addEventListener('scroll', updateScrollPos, { passive: true })
    }
    updateScrollPos()
  })
  onUnmounted(() => {
    curContainer.value.removeEventListener('scroll', updateScrollPos)
  })

  return {
    scrollX,
    scrollY,
    scrollDirection,
    setContainer,
    resetToWindow,
    isScrollXTo,
    isScrollYTo,
    isInViewport,
  }
}
