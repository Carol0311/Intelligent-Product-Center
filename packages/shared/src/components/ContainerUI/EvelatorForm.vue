<template>
  <div ref="anchorGroup" class="smart-evelator">
    <div v-if="config.showAnchor" class="smart-evelator-anchor bg-white">
      <div class="inline-flex bg-gray-100 p-1 rounded relative">
        <div class="anchor-list flex items-center" :class="{ 'flex-row': config.direct === 0, 'flex-col': config.direct === 1 }">
          <div v-for="(tab, i) in children" :key="i" class="item px-4 h-6 leading-6 cursor-pointer z-10" :class="{ 'text-orange-300': active === i }" @click="(e) => clickEvt(i, e)">
            {{ tab.props.tabTitle }}
          </div>
        </div>
        <div class="anchor-animation absolute rounded bg-white text-orange-300 z-0" :style="anchorStyle"></div>
      </div>
    </div>
    <DynamicItem :data="data" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { eventBus } from '@shared/globals/eventBus'
import type { ComponentSchema } from '@shared/schema'
import { useUiConfig } from '@shared/composables/useUiConfig'
import DynamicItem from './DynamicItem.vue'

// #if [LOWCODE]
//@ts-ignore - 仅在lowcode构建时存在
import { useEditorStore } from '@/stores'
// #endif

// #if [PRODUCT]
//@ts-ignore - 仅在product构建时存在
import { usePageStore } from '@/stores'
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
const { config } = ui

const children = computed(() => {
  const components = currentPage.value?.components || {}
  return props.data.children.map((id) => components[id])
})

//tab滚动联动
const anchorGroup = ref<HTMLElement | null>(null)
const active = ref(0)
const tabsTop: number[] = []
const anchorsList: number[][] = []
const anchorStyle = ref<{
  width?: string
  height?: string
  transform?: string
}>()
onMounted(() => {
  const tabs = anchorGroup.value?.querySelectorAll('.smart-tab') as NodeListOf<HTMLElement>
  const anchors = anchorGroup.value?.querySelectorAll('.anchor-list .item') as NodeListOf<HTMLElement>
  ;[...anchors?.entries()].forEach(([_i, anchor]) => {
    anchorsList.push([anchor.clientWidth, anchor.clientHeight])
  })
  Array.from(tabs?.entries()).forEach(([_index, node]) => {
    tabsTop.push(node.offsetTop)
  })
  eventBus.emit('init-related-scroll', tabsTop)
})
const clickEvt = function (index: any, e: any) {
  active.value = index
  anchorStyle.value = {
    width: `${e.target.clientWidth}px`,
    height: `${e.target.clientHeight}px`,
    transform: `translateX(${e.target.clientWidth * index}px)`,
  }
  eventBus.emit('scroll-root', { top: tabsTop[index] })
}
const onSelectTab = (options: any) => {
  active.value = options.active
  const anchor = anchorsList[options.active] ?? [56, 24]
  anchorStyle.value = {
    width: `${anchor[0]}px`,
    height: `${anchor[1]}px`,
    transform: `translateX(${anchor[0] ?? 56 * options.active}px)`,
  }
}
eventBus.on('select-tab', onSelectTab)
onUnmounted(() => {
  eventBus.off('select-tab', onSelectTab)
})
</script>
<style scoped>
.anchor-animation {
  width: 58px;
  height: 24px;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
  transition-duration: 0.5s;
}
</style>
