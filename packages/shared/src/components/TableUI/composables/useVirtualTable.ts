//虚拟滚动逻辑

import { ref, computed, type Ref } from 'vue'
import { VirtualTableCore } from '../core/VirtualTableCore'

export function useVirtualTable(options: { rowHeight: number; totalRows: number; overscanCount?: number; tbContainer?: Ref<HTMLElement | null>; mode: 'DOM' | 'CANVAS' }) {
  const scrollTop = ref(0)
  const containerHeight = ref(0)

  // 是否快速滚动中
  const isFastScrolling = ref(false)
  // 精确渲染的范围（正常滚动时使用）
  const exactRange = ref({ start: 0, end: options.overscanCount || 20 })
  // 快速滚动时的粗略范围（只显示占位符）
  const roughRange = ref({ start: 0, end: 0 })

  let _totalRows = options.totalRows
  let stopTimer: any = null
  let rafId: number | null = null
  let lastScrollTop = 0
  let lastScrollTime = 0

  const core = new VirtualTableCore({
    rowHeight: options.rowHeight,
    totalRows: options.totalRows,
    overscanCount: options.overscanCount,
    mode: options.mode,
  })

  // 退出快速滚动模式，恢复精确渲染
  const exitFastScroll = () => {
    if (!isFastScrolling.value) return

    isFastScrolling.value = false
    // 立即计算当前位置的精确范围
    exactRange.value = core.updateScroll(scrollTop.value, containerHeight.value)
  }

  // 检测滚动速度
  const getScrollVelocity = (currentScrollTop: number): number => {
    const now = Date.now()
    const timeDiff = now - lastScrollTime
    if (timeDiff > 0 && lastScrollTop > 0) {
      const distance = Math.abs(currentScrollTop - lastScrollTop)
      return distance / timeDiff // px/ms
    }
    return 0
  }

  // 计算粗略范围（用于快速滚动时）
  const calculateRoughRange = (scrollTop: number) => {
    const start = Math.floor(scrollTop / options.rowHeight)
    const visibleCount = Math.ceil(containerHeight.value / options.rowHeight)

    return {
      start: Math.max(0, start),
      end: Math.min(_totalRows, start + visibleCount),
    }
  }

  // 计算精确范围（正常滚动时）
  const calculateExactRange = (scrollTop: number) => {
    const range = core.updateScroll(scrollTop, containerHeight.value)
    return { start: range.start, end: range.end }
  }

  const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement
    containerHeight.value = target.clientHeight
    const newScrollTop = target.scrollTop
    const velocity = getScrollVelocity(newScrollTop)

    // 清除停止定时器
    if (stopTimer) clearTimeout(stopTimer)

    // 滚动停止，就退出快速模式
    stopTimer = setTimeout(() => {
      exitFastScroll()
    }, 100)

    const isFast = velocity > 0.8

    if (isFast && !isFastScrolling.value) {
      // 进入快速滚动模式
      isFastScrolling.value = true
      roughRange.value = calculateRoughRange(newScrollTop)
    } else if (!isFast && isFastScrolling.value) {
      // 退出快速滚动模式，立即计算精确范围
      isFastScrolling.value = false
      exactRange.value = calculateExactRange(newScrollTop)
    } else if (!isFastScrolling.value) {
      // 正常滚动模式，实时更新精确范围
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        exactRange.value = calculateExactRange(newScrollTop)
        rafId = null
      })
    } else {
      // 快速滚动模式，更新粗略范围
      roughRange.value = calculateRoughRange(newScrollTop)
    }

    // 更新记录
    scrollTop.value = newScrollTop
    lastScrollTop = newScrollTop
    lastScrollTime = Date.now()
  }

  // 实际使用的可见范围
  const visibleRange = computed(() => {
    if (isFastScrolling.value) {
      return { ...roughRange.value, isFast: true }
    }
    return { ...exactRange.value, isFast: false }
  })

  const updateTotalRows = (totalRows: number) => {
    core.updateTotalRows(totalRows)
    _totalRows = totalRows
  }

  // 计算偏移量
  const offsetY = computed(() => {
    if (isFastScrolling.value) {
      // 快速滚动时，粗略偏移
      return roughRange.value.start * options.rowHeight
    }
    return core.getOffsetY(scrollTop.value)
  })

  return {
    visibleRange,
    offsetY,
    isFastScrolling,
    handleScroll,
    updateTotalRows,
  }
}
