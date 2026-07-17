<template>
  <div>
    <PagesTab @show-edit="(arg) => showToolEvt(arg)" />
    <div
      ref="viewRef"
      class="overflow-auto p-3 relative flex-1 dropable-item"
      :class="{ 'border border-dotted border-orange-300': currentDragover === currentPageId }"
      @dragover.prevent.stop="handleDragover(rootComponents[0], currentPageId)"
      @drop.stop="handleDropEvt(currentPageId)"
    >
      <component
        :is="get(com.type)"
        v-for="com in rootComponents || []"
        :key="com.id"
        :data="com"
        :data-id="com.id"
        class="dropable-item cursor-move"
        :class="{ 'border border-dotted border-orange-300': currentDragover === com.id }"
        :draggable="true"
        :style="com.props.inlineStyle"
        @click.stop="clickRef(com.id)"
        @dragstart.stop="handleDragStart(com.type, com)"
        @dragover.prevent.stop="handleDragover(com)"
        @drop.stop="handleDropEvt(com.id)"
      />
      <Edit v-show="showTool" @show-edit="(arg) => showToolEvt(arg)" />
    </div>
    <div class="w-full text-center text-zinc-400 py-2">粤ICP备2026008119号-1</div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, watch, onUnmounted, onMounted, computed } from 'vue'
import Edit from '@/components/ToolUI/Edit.vue'
import { eventBus, useScrollPosition, useElementResize, componentRegistry } from 'public-shared'
import { useProjectStore, useEditorStore, useDragStore } from '@/stores'

import { getPageDetail, getPageList } from 'public-shared'
import PagesTab from './PagesTab.vue'

const viewRef = ref<HTMLElement | null>(null)
const isPageLoaded = ref(false)

const { get } = componentRegistry

const editorStore = useEditorStore()
const projectStore = useProjectStore()

const { currentPage, currentPageId } = storeToRefs(editorStore)

const { setProject } = projectStore
const { setCurrentPage, setSelectedComponent } = editorStore

const dragStore = useDragStore()
const { currentDragover } = storeToRefs(dragStore)
const { handleDropEvt, handleDragover, handleDragStart } = dragStore

onMounted(() => {
  getPageList().then((res) => {
    if (res.success && res.data) {
      setProject(res.data.pageList)
      if (res.data.pageList.length > 0) {
        setCurrentPage(res.data.pageList[0])
      }
    }
  })
})
useElementResize(viewRef, () => {
  showTool.value = false
})
//根页面组件
const rootComponents = computed(() => {
  if (!isPageLoaded.value) return []
  const components = currentPage.value?.components || {}
  const rootIds = currentPage.value?.rootComponentIds || []
  return rootIds.map((id: string) => components[id])
})
//点击组件选中
const clickRef = (componentId: string) => {
  setSelectedComponent(componentId)
}
watch(
  () => currentPageId.value,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      getPageDetail({ id: currentPage.value?.id, pageId: currentPage.value?.pageId }).then(
        (res) => {
          if (res.success) {
            isPageLoaded.value = true
            setCurrentPage({ ...res.data!, isSaved: undefined })
          }
        },
      )
    }
  },
  { immediate: true, deep: true },
)
//显示组件编辑工具栏
const showTool = ref(false)
const showToolEvt = (arg: boolean) => {
  showTool.value = arg
}
//页签选择与页面滚动联动事件处理
const scrollPosition = useScrollPosition()
let tabsTop: number[] = []
const onInitRelated = (tops: number[]) => {
  tabsTop = tops
}
const onScrollRoot = (options: ScrollToOptions) => {
  if (viewRef.value) {
    viewRef.value.scrollTo({ top: options.top || 0 })
  }
}
eventBus.on('init-related-scroll', onInitRelated)
eventBus.on('scroll-root', onScrollRoot)
onUnmounted(() => {
  eventBus.off('init-related-scroll', onInitRelated)
  eventBus.off('scroll-root', onScrollRoot)
})
watch(
  viewRef,
  (newContainer) => {
    if (newContainer) {
      scrollPosition.setContainer(newContainer)
    }
  },
  { immediate: true },
)
const { scrollY } = scrollPosition
watch(scrollY, (newY) => {
  showTool.value = false
  setSelectedComponent(null)
  let midValue = tabsTop[0] ?? 0
  if (tabsTop.length > 0 && newY > midValue) {
    let i = Math.floor(tabsTop.length / 2)
    midValue = tabsTop[i] ?? 0
    i = newY > midValue ? i + 1 : i - 1
    eventBus.emit('select-tab', { active: i })
  }
})
</script>
<style scoped></style>
