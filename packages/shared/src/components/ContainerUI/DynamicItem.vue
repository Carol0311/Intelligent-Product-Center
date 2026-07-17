<template>
  <div class="dynamic-container" :class="dynamicClass.class" :style="dynamicClass.style">
    <template v-if="children && children.length > 0">
      <!--#if [LOWCODE]-->
      <component
        :is="get(com.type)"
        v-for="com in children"
        v-model="currentModel[com.id]"
        :key="com.id"
        :data="com"
        :data-id="com.id"
        class="dropable-item cursor-move"
        :class="{ 'border border-dotted border-orange-300': currentDragover === com.id }"
        :draggable="true"
        @click.stop="clickRef(com.id)"
        @dragstart.stop="handleDragStart(com.type, com)"
        @dragover.prevent.stop="handleDragover(com)"
        @drop.stop="handleDropEvt(com.id)"
      ></component>
      <!--#endif-->
      <!--#if [PRODUCT]-->
      <component :is="get(com.type)" v-model="currentModel[com.id]" v-for="com in children" :key="com.id" :data="com" :data-id="com.id" @model-change="handleModelChange(com.id, $event)"></component>
      <!--#endif-->
    </template>
    <template v-else>
      <!--#if [LOWCODE]-->
      <div class="empty-placeholder min-h-16 flex justify-center items-center text-zinc-500 w-full">拖拽组件或模版到这里</div>
      <!--#endif-->
    </template>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { componentRegistry } from '@shared/registry/componentRegistry'
import type { ComponentSchema } from '@shared/schema'
import { useUiConfig } from '@shared/composables/useUiConfig'

// #if [LOWCODE]
//@ts-ignore - 仅在lowcode构建时存在
import { useEditorStore, useDragStore, useModelStore } from '@/stores'
// #endif

// #if [PRODUCT]
//@ts-ignore - 仅在product构建时存在
import { usePageStore, useModelStore } from '@/stores'
// #endif

const { get } = componentRegistry

let storeRefs
// #if [LOWCODE]
const editorStore = useEditorStore()
//@ts-ignore - 仅在lowcode构建时存在
const { currentPage } = storeToRefs(editorStore)
const { setSelectedComponent } = editorStore

const dragStore = useDragStore()
const { currentDragover } = storeToRefs(dragStore)
const { handleDropEvt, handleDragover, handleDragStart } = dragStore
// #endif

// #if [PRODUCT]
const pageStore = usePageStore()
//@ts-ignore - 仅在product构建时存在
const { currentPage } = storeToRefs(pageStore)
// #endif

const modelStore = useModelStore()
const { setCurrentModel, getCurrentModel } = modelStore

const props = defineProps<{
  data: ComponentSchema
}>()
const ui = useUiConfig(props.data.id)
const { config } = ui
//不同父组件动态样式处理
const dynamicClass = computed(() => {
  switch (props.data.type) {
    case 'Container':
      return {
        class: {
          'border border-dotted border-zinc-300': children.value?.length < 1,
          'bg-white p-4 pb-0': children.value?.length > 0,
        },
        style: children.value.length > 0 ? { ...config.value.inlineStyle, 'grid-template-columns': `repeat(${config.value.tabLayout}, minmax(0, 1fr))` } : {},
      }
    case 'Panel':
      return {
        class: {
          'border border-dotted border-zinc-300': children.value?.length < 1,
          'bg-white': children.value?.length > 0,
          'flex-col': config.value.flexDirect === 'column',
          'flex-row': config.value.flexDirect === 'row',
        },
        style: { ...config.value.inlineStyle, 'grid-column': config.value.col && `span ${config.value.col}` },
      }
    case 'AdvanceForm':
      return {
        style: { ...config.value.inlineStyle, 'grid-template-columns': `repeat(${config.value.tabLayout}, minmax(0, 1fr))` },
      }
    default:
      return {}
  }
})

//容器子节点
const children = computed(() => {
  const components = currentPage.value?.components || {}
  return props.data.children.map((id) => components[id])
})
//字段model
const currentModel = computed(() => {
  return getCurrentModel(currentPage.value?.pageId) || {}
})

//lowcode平台组件点击选中标记
const clickRef = (componentId: string) => {
  // #if [LOWCODE]
  setSelectedComponent(componentId)
  // #endif
}
//字段更新触发change
// #if [PRODUCT]
const handleModelChange = (comId: string, value: any) => {
  setCurrentModel(currentPage.value?.pageId, {
    ...currentModel.value,
    [comId]: value,
  })
}
// #endif
</script>
<style scoped></style>
