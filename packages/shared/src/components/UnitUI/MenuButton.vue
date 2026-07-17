<template>
  <div class="smart-menu-button relative">
    <div class="flex flex-row w-28 leading-6 border border-solid border-zinc-300 rounded text-zinc-500 px-1">
      <div class="flex-1 border-r border-solid border-zinc-300">菜单</div>
      <div class="w-9 text-center" @click="toggleList">
        <!--#if [PRODUCT]-->
        <ClientOnly>
          <PhCaretDown :size="16" weight="thin" />
        </ClientOnly>
        <!--#endif-->
        <!--#if [LOWCODE]-->
        <PhCaretDown :size="16" weight="thin" />
        <!--#endif-->
      </div>
    </div>
    <div v-show="showList" class="fixed button-list text-orange-300 bg-white w-28 p-2 shadow-sm">
      <div class="leading-5">复制</div>
      <div class="leading-5">新建</div>
      <div class="leading-5">保存</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { PhCaretDown } from '@phosphor-icons/vue'
import { useUiConfig } from '@shared/composables/useUiConfig'
import type { ComponentSchema } from '@shared/schema'

const props = defineProps<{
  data: ComponentSchema
}>()
const ui = useUiConfig(props.data.id)

const showList = ref(false)

const toggleList = () => {
  showList.value = !showList.value
}
</script>
