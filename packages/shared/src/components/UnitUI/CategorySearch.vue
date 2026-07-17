<template>
  <div class="smart-search flex flex-row mb-4 items-center bg-white w-fit text-sm border border-solid border-orange-300 rounded" :data-id="data.props.cid">
    <div class="flex flex-row items-center leading-7 px-1 text-xs text-zinc-400 border-r border-solid border-orange-300">
      <span>类别1</span>
      <!--#if [PRODUCT]-->
      <ClientOnly>
        <PhCaretDown :size="12" class="ml-1" />
      </ClientOnly>
      <!--#endif-->
      <!--#if [LOWCODE]-->
      <PhCaretDown :size="12" class="ml-1" />
      <!--#endif-->
    </div>
    <div class="smart-form-item-inputBox inline-table align-middle">
      <input ref="searchInput" type="text" class="px-2 min-w-48" @change="searchEvt" />
    </div>
    <div class="flex flex-row items-center leading-7 px-2 bg-orange-300 text-white border-l border-solid border-orange-300" @click="searchEvt">
      <!--#if [PRODUCT]-->
      <ClientOnly>
        <PhMagnifyingGlass :size="16" class="" />
      </ClientOnly>
      <!--#endif-->
      <!--#if [LOWCODE]-->
      <PhMagnifyingGlass :size="16" class="" />
      <!--#endif-->
      <span>搜索</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { PhMagnifyingGlass, PhCaretDown } from '@phosphor-icons/vue'
import type { ComponentSchema } from '@shared/schema/component'
import { useUiConfig } from '@shared/composables/useUiConfig'
const props = defineProps<{
  data: ComponentSchema
}>()
const ui = useUiConfig(props.data.id)
const searchInput = useTemplateRef<HTMLInputElement>('searchInput')
const searchEvt = () => {
  const searchText = searchInput.value?.value.trim()
  console.log(searchText)
  //send search request
}
</script>
<style coped></style>
