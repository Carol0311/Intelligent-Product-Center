<template>
  <FormItem :data="props.data" class="smart-date smart-date-range">
    <template #[dynamicSlot]="{ config, ui, icon, platForm }">
      <!--#if [PRODUCT]-->
      <ClientOnly>
        <VueDatePicker
          v-model="rangeValue"
          range
          :locale="zhCN"
          model-type="yyyy-MM-dd"
          :formats="{ input: 'yyyy-MM-dd' }"
          format="yyyy-MM-dd"
          :disabled="config.disable"
          :readonly="platForm === 'lowcode' || config.readonly || config.tabStatus === 0"
          :class="{ disabled: config.disable }"
          @update:model-value="handleChange"
        >
          <template #input-icon> </template>
        </VueDatePicker>
      </ClientOnly>
      <!--#endif-->
      <!--#if [LOWCODE]-->
      <VueDatePicker
        v-model="rangeValue"
        range
        :locale="zhCN"
        model-type="yyyy-MM-dd"
        :formats="{ input: 'yyyy-MM-dd' }"
        format="yyyy-MM-dd"
        :disabled="config.disable"
        :readonly="platForm === 'lowcode' || config.readonly || config.tabStatus === 0"
        :class="{ disabled: config.disable }"
        @update:model-value="handleChange"
      >
        <template #input-icon> </template>
      </VueDatePicker>
      <!--#endif-->
    </template>
  </FormItem>
</template>
<script setup lang="ts">
import '@vuepic/vue-datepicker/dist/main.css'

import { computed } from 'vue'

import { VueDatePicker } from '@vuepic/vue-datepicker'
import { zhCN } from 'date-fns/locale'

import FormItem from '@shared/components/SlotUI/FormItem.vue'
import type { ComponentSchema, ColumnSchema } from '@shared/schema'

const emits = defineEmits(['model-change', 'cell-change'])

const props = defineProps<{
  data: ComponentSchema | ColumnSchema
}>()

const dynamicSlot = computed(() => {
  return props.data.props.inTable ? 'cellMain' : 'main'
})

const dateRangeValue = defineModel<string[]>({ default: () => ['2026-05-16', '2026-05-23'] })
const rangeValue = dateRangeValue.value

const handleChange = (selectDates: any) => {
  // #if [PRODUCT]
  if (props.data.props.inTable) {
    emits('cell-change', selectDates)
  } else {
    emits('model-change', selectDates)
  }
  // #endif
}
</script>
<style scoped>
.date-input {
  margin-right: -1.25rem;
}
</style>
