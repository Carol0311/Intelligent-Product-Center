<template>
  <div ref="appPage" class="lowcode-plat smart-app flex flex-col bg-gray-100 relative">
    <AppHeader class="lowcode-header" />
    <div class="lowcode-container smart-container flex flex-row">
      <LeftMenu />
      <ViewContent
        class="flex-1 flex flex-col relative"
        :style="{ width: `${viewWidth}px`, minWidth: '670px' }"
      />
      <RightPanel />
    </div>
    <Modal v-if="showModal" :data="showModal" @close-modal="() => (showModal = null)" />
    <Info v-if="showInfo" :data="showInfo" @close-info="() => (showInfo = null)" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { AppHeader, LeftMenu, RightPanel, ViewContent } from './layout'
import { eventBus, Modal, Info, ErrorInfo, ShortErrorInfo, useElementResize } from 'public-shared'

const appPage = ref<HTMLElement | null>(null)

const showModal = ref<ErrorInfo | null>(null)
const showInfo = ref<ShortErrorInfo | null>(null)
const viewWidth = ref(0)

const handleResize = () => {
  viewWidth.value = appPage.value?.clientWidth ? appPage.value.clientWidth - 48 - 320 : 0
}

onMounted(() => {
  viewWidth.value = appPage.value?.clientWidth ? appPage.value.clientWidth - 48 - 320 : 0
  useElementResize(appPage, handleResize)
})

eventBus.on('show-modal', (data) => {
  showModal.value = data
})
eventBus.on('show-Info', (data) => {
  showInfo.value = data
})
</script>
<style scoped>
.lowcode-plat {
  overflow: hidden;
}
.lowcode-header {
  height: 3rem;
}
.lowcode-container {
  height: calc(100vh - 3rem);
  overflow: hidden;
}
</style>
