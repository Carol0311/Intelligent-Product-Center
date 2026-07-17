<template>
  <div class="smart-tab border border-solid border-zinc-300 mb-5 rounded bg-white">
    <div class="smart-tab-head px-4">
      <div class="smart-tab-head-main mt-2 border-b border-solid border-zinc-300">
        <div class="smart-tab-title pl-2 text-gray-600 text-base relative">
          {{ config.tabTitle }}
        </div>
      </div>
    </div>
    <div class="smart-tab-body py-3 px-4">
      <div class="smart-tab-content overflow-hidden" :style="{ height: `${tabFormHeight}px` }">
        <div ref="tabForm" class="smart-tab-form">
          <DynamicItem class="grid gap-4" :data="data" :style="`grid-template-columns: repeat(${config.tabLayout}, minmax(0, 1fr));`" />
        </div>
      </div>
      <div class="smart-tab-footer text-orange-300 text-xs">
        <div class="flex flex-row items-center" @click="clickEvt">
          <span>{{ direct }}</span>
          <!--#if [PRODUCT]-->
          <ClientOnly>
            <PhCaretDown v-show="fold" :size="14" weight="light" />
            <PhCaretUp v-show="!fold" :size="14" weight="light" />
          </ClientOnly>
          <!--#endif-->
          <!--#if [LOWCODE]-->
          <PhCaretDown v-show="fold" :size="14" weight="light" />
          <PhCaretUp v-show="!fold" :size="14" weight="light" />
          <!--#endif-->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PhCaretDown, PhCaretUp } from '@phosphor-icons/vue'
import type { ComponentSchema } from '@shared/schema'
import { useUiConfig } from '@shared/composables/useUiConfig'
import DynamicItem from './DynamicItem.vue'

const props = defineProps<{
  data: ComponentSchema
}>()
const ui = useUiConfig(props.data.id)
const { config } = ui

/**展开收起功能*/
const DEFAULT_HEIGHT = 130
const fold = ref(true)
const direct = ref('展开')
const tabForm = ref<HTMLElement | null>(null)
const tabFormHeight = ref(DEFAULT_HEIGHT)
onMounted(() => {
  tabFormHeight.value = fold.value ? DEFAULT_HEIGHT : tabForm.value?.clientHeight || DEFAULT_HEIGHT
})
const clickEvt = () => {
  fold.value = !fold.value
  if (fold.value === true) {
    direct.value = '展开'
    tabFormHeight.value = DEFAULT_HEIGHT
  } else {
    direct.value = '收起'
    tabFormHeight.value = tabForm.value?.clientHeight || DEFAULT_HEIGHT
  }
}
</script>
<style scoped>
.smart-tab-title::before {
  content: '';
  display: inline-block;
  height: 16px;
  width: 3px;
  background: rgb(253 186 116 / var(--tw-text-opacity, 1));
  position: absolute;
  left: 0;
  top: calc(50% - 8px);
}
</style>
