<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
  <Modal v-if="showModal" :data="showModal" @close-modal="() => (showModal = null)" />
  <Info v-if="showInfo" :data="showInfo" @close-info="() => (showInfo = null)" />
</template>
<script setup lang="ts">
import { eventBus, componentRegistry, Modal, Info, Container, Panel, AdvanceForm, EvelatorForm, NormalForm } from 'public-shared'
import type { ErrorInfo, ShortErrorInfo } from 'public-shared'

const showModal = ref<ErrorInfo | null>(null)
const showInfo = ref<ShortErrorInfo | null>(null)

//提前注册容器组件，避免循环引用
componentRegistry.initContainer([
  { name: 'Container', component: Container },
  { name: 'Panel', component: Panel },
  { name: 'AdvanceForm', component: AdvanceForm },
  { name: 'EvelatorForm', component: EvelatorForm },
  { name: 'NormalForm', component: NormalForm },
])
// #if [LOWCODE]
console.log('this is lowcode')
// #endif

// #if [PRODUCT]
console.log('this is product')
// #endif

eventBus.on('show-modal', (data) => {
  showModal.value = data
})
eventBus.on('show-Info', (data) => {
  showInfo.value = data
})
</script>
