<template>
  <FormItem :data="props.data" class="smart-date">
    <template #[dynamicSlot]="{ config, ui, icon, platForm }">
      <!--#if [PRODUCT]-->
      <ClientOnly>
        <VueDatePicker
          v-model="dateValue"
          ref="datePicker"
          :locale="zhCN"
          model-type="yyyy-MM-dd"
          :formats="{ input: 'yyyy-MM-dd' }"
          :disabled="config.disable"
          :readonly="platForm === 'lowcode' || config.readonly || config.tabStatus === 0"
          :class="{ disabled: config.disable }"
          @update:model-value="handleChange"
        >
          <template #input-icon>
            <PhCalendar size="16" class="text-orange-300" />
          </template>
        </VueDatePicker>
      </ClientOnly>
      <!--#endif-->
      <!--#if [LOWCODE]-->
      <VueDatePicker
        v-model="dateValue"
        ref="datePicker"
        :locale="zhCN"
        model-type="yyyy-MM-dd"
        :formats="{ input: 'yyyy-MM-dd' }"
        :disabled="config.disable"
        :readonly="platForm === 'lowcode' || config.readonly || config.tabStatus === 0"
        :class="{ disabled: config.disable }"
        @update:model-value="handleChange"
      >
        <template #input-icon>
          <PhCalendar size="16" class="text-orange-300" />
        </template>
      </VueDatePicker>
      <!--#endif-->
    </template>
  </FormItem>
</template>
<script setup lang="ts">
import '@vuepic/vue-datepicker/dist/main.css'

import { computed } from 'vue'
import { PhCalendar } from '@phosphor-icons/vue'
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
const dateValue = defineModel({ default: '2026-05-16' })

const handleChange = (selectDate: any) => {
  // #if [PRODUCT]
  if (props.data.props.inTable) {
    emits('cell-change', selectDate)
  } else {
    emits('model-change', selectDate)
  }
  // #endif
}
</script>
