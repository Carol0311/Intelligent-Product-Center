<template>
  <div class="smart-search flex flex-row mb-4 items-center bg-white w-fit border border-solid border-orange-300 rounded" :data-id="data.props.cid">
    <div class="smart-form-item-inputBox inline-table align-middle">
      <input ref="searchInput" type="text" class="px-2 min-w-48" @change="searchEvt" />
    </div>
    <div class="flex flex-row items-center leading-7 px-2 bg-orange-300 text-white h-full border-l border-solid border-orange-300" @click="searchEvt">
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
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import type { ComponentSchema } from '@shared/schema/component'
import { useUiConfig } from '@shared/composables/useUiConfig'
import { useTemplateRef } from 'vue'
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
<style scoped></style>
