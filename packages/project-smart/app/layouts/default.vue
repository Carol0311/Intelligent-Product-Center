<template>
  <div class="smart-app flex flex-col bg-gray-100 h-full" ref="appPage" id="appPage">
    <AppHeader />
    <div class="smart-container flex flex-row">
      <MenuList />
      <div class="s-right flex-1 h-full overflow-auto p-4 pt-0">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getPageList, eventBus, useScrollPosition } from 'public-shared'
import { useProjectStore } from '@/stores/projectStore'

const { setProject } = useProjectStore()
const appPage = ref<HTMLElement>()

onMounted(() => {
  getPageList().then((res) => {
    if (res.success && res.data) {
      setProject(res.data.pageList)
    }
  })
})

//监听滚动事件，控制页面滚动和tab切换
const scrollPosition = useScrollPosition()
let tabsTop: number[] = []

eventBus.on('init-related-scroll', (tops: number[]) => {
  tabsTop = tops
})
eventBus.on('scroll-root', (options: ScrollToOptions) => {
  if (appPage.value) {
    appPage.value.scrollTo({ top: options.top || 0 })
  }
})
watch(
  appPage,
  (newContainer) => {
    if (newContainer) {
      scrollPosition.setContainer(newContainer)
    }
  },
  { immediate: true }
)
const { scrollY } = scrollPosition
watch(scrollY, (newY) => {
  let midValue = tabsTop[0] ?? 0
  if (tabsTop.length > 0 && newY > midValue) {
    let i = Math.floor(tabsTop.length / 2)
    midValue = tabsTop[i] ?? 0
    i = newY > midValue ? i + 1 : i - 1
    eventBus.emit('select-tab', { active: i })
  }
})
</script>
<style scoped>
.smart-container {
  height: calc(100vh - 48px);
}
</style>
