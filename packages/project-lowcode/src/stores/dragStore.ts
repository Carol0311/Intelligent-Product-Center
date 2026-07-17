import { ref, toRaw } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { ComponentType, ComponentSchema } from 'public-shared'
import { useEditorStore } from './editorStore'
//处理拖拽相关状态
export const useDragStore = defineStore('drag', () => {
  const editorStore = useEditorStore()
  const { selectedComponent } = storeToRefs(editorStore)
  const { dropComponent, moveComponent } = editorStore
  //当前拖拽组件类型
  const currentDragType = ref<ComponentType>()
  //当前拖拽组件
  const currentDrag = ref<string | undefined>('')
  //当前拖拽悬停组件
  const currentDragover = ref<string>('')
  //当前拖拽放置组件
  const currentDrop = ref<string>('')
  //原子组件携带的默认属性
  const currentDragProps = ref<Record<string, any>>({})
  //放置位置
  const dropPosition = ref<'top' | 'bottom' | 'left' | 'right'>('bottom')
  //拖拽组件节点
  const dragElement = ref<HTMLElement | null>(null)

  //拖拽开始事件
  const handleDragStart = (
    dragType: string,
    dragComponent?: ComponentSchema,
    defaultProps?: Record<string, any>,
  ) => {
    currentDragType.value = dragType as ComponentType
    if (dragComponent) {
      //拖拽页面组件
      if (selectedComponent.value?.id === dragComponent.id) {
        currentDrag.value = dragComponent?.id
      } else {
        if (selectedComponent.value?.id === dragComponent.parentId) {
          currentDrag.value = dragComponent.parentId
        } else {
          currentDrag.value = dragComponent?.id
        }
      }
      dragElement.value = document.querySelector(`[data-id="${currentDrag.value}"]`) as HTMLElement
    } else {
      //拖拽左边列表原子组件
      currentDrag.value = ''
      dragElement.value = null
      if (defaultProps) {
        currentDragProps.value = defaultProps
      }
    }
    document.querySelectorAll('.dropable-item').forEach((zone) => {
      observer.observe(zone)
    })
  }
  //拖拽悬停事件
  const handleDragover = (dragComponent: ComponentSchema, rootPageId?: string) => {
    if (rootPageId) {
      currentDragover.value = rootPageId
    } else {
      if (dragComponent.props.isContainer) {
        currentDragover.value = dragComponent.id
      } else {
        if (dragComponent.parentId) {
          currentDragover.value = dragComponent.parentId
        }
      }
    }
  }

  //拖拽放置事件
  const handleDropEvt = (dropId: string) => {
    currentDrop.value = dropId
    if (currentDrag.value) {
      //拖拽页面已生成组件
      moveComponent(currentDrag.value!, currentDrop.value, dropPosition.value)
    } else {
      //拖拽未生成的原子组件
      dropComponent(currentDrop.value, currentDragType.value!, toRaw(currentDragProps.value))
    }
    currentDragover.value = ''
  }
  // 观察拖拽元素与目标元素的重叠比例
  const observer = new IntersectionObserver(
    (entries) => {
      if (dragElement.value) {
        const intersectingEntries = entries.filter((entry) => entry.isIntersecting)
        // 节点深度降序排列，取深度最大的目标节点
        const deepestEntry = intersectingEntries.sort((a, b) => {
          const depthA = getDepth(a.target as HTMLElement)
          const depthB = getDepth(b.target as HTMLElement)
          return depthB - depthA
        })[0]
        if (deepestEntry) {
          const targetRect = deepestEntry.target.getBoundingClientRect()
          const dragRect = dragElement.value.getBoundingClientRect()

          // 计算两个矩形的位置关系
          const horizontalOverlap =
            Math.min(dragRect.right, targetRect.right) - Math.max(dragRect.left, targetRect.left)
          const verticalOverlap =
            Math.min(dragRect.bottom, targetRect.bottom) - Math.max(dragRect.top, targetRect.top)

          if (horizontalOverlap > verticalOverlap) {
            // 水平重叠更大，判定为左右放置
            const isRight = dragRect.left > targetRect.left
            dropPosition.value = isRight ? 'right' : 'left'
          } else {
            // 垂直重叠更大，判定为上下放置
            const isBottom = dragRect.top > targetRect.top
            dropPosition.value = isBottom ? 'bottom' : 'top'
          }
        }
      }
    },
    {
      threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
    },
  )
  //获取节点深度
  const getDepth = (element: HTMLElement) => {
    let depth = 0
    let current = element
    while (current.parentElement) {
      depth++
      current = current.parentElement
    }
    return depth
  }
  return {
    currentDrag,
    currentDragover,
    currentDrop,
    handleDragStart,
    handleDragover,
    handleDropEvt,
  }
})
