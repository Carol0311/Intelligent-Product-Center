<template>
  <div class="smart-button bg-orange-300 text-white rounded-xl w-20 leading-6 text-center" @click="handleClick">{{ data.props.label }}</div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUiConfig } from '@shared/composables/useUiConfig'
import type { ComponentSchema, PageSchema } from '@shared/schema'
import { buttonClick } from '@shared/http/pageApi'

// #if [LOWCODE]
//@ts-ignore - 仅在lowcode构建时存在
import { useEditorStore } from '@/stores'
// #endif

// #if [PRODUCT]
//@ts-ignore - 仅在product构建时存在
import { usePageStore, useModelStore } from '@/stores'
const modelStore = useModelStore()
const { getCurrentModel } = modelStore
// #endif

// #if [LOWCODE]
const editorStore = useEditorStore()
//@ts-ignore - 仅在lowcode构建时存在
const { currentPage } = storeToRefs(editorStore)
// #endif

// #if [PRODUCT]
const pageStore = usePageStore()
//@ts-ignore - 仅在product构建时存在
const { currentPage } = storeToRefs(pageStore)
// #endif

const props = defineProps<{
  data: ComponentSchema
}>()
const ui = useUiConfig(props.data.id)

const handleClick = () => {
  // #if [PRODUCT]
  const currentModel = getCurrentModel(currentPage.value?.pageId) || {}
  buttonClick({ ...currentPage.value, service: 'save', changeData: currentModel })
  // #endif
}
</script>
