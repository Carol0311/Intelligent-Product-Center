<template>
  <div class="smart-operation">
    <div v-for="option of optionsItems" :key="option.name" @click="handleClick(option)" class="smart-operation-item cursor-pointer text-orange-300">
      {{ option.name }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { ComponentSchema, ColumnSchema } from '@shared/schema'
// #if [PRODUCT]
//@ts-ignore - 仅在product构建时存在
import { usePageStore } from '@/stores'
const pageStore = usePageStore()
//@ts-ignore - 仅在product构建时存在
const { currentPage } = storeToRefs(pageStore)
// #endif
const props = defineProps<{
  data: ComponentSchema | ColumnSchema
  instanceId?: string
  rowCode?: string
}>()
let optionValue = defineModel<string[]>({
  default: () => [],
})
const optionsItems = computed(() => {
  if (optionValue.value && optionValue.value.length === 0) {
    return props.data.props.options
  }
  return props.data.props.options.filter((item: any) => optionValue.value.includes(item.service))
})
const emits = defineEmits(['operation-click'])
const handleClick = (option: any) => {
  // #if [PRODUCT]
  if (option.service === 'view') {
    if (props.data.props.inTable) {
      //@ts-ignore - 仅在product构建时存在
      const config = useRuntimeConfig()
      let fpageId = '' as any
      let fname = currentPage.value?.name.replace('列表', '')
      if (currentPage.value?.pageId.match('AI_GOODSLIST')) {
        fpageId = currentPage.value?.pageId.replace('GOODSLIST', 'GOODSFORM')
      } else {
        fpageId = currentPage.value?.pageId.replace('List', '')
      }
      window.open(`./dynamic?preview=${fpageId}&name=${fname}&instanceId=${props.instanceId}&&rowCode=${props.rowCode}`, '_blank')
    }
  }
  // #endif
}
</script>
