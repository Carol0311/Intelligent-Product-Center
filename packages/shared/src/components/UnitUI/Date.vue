<template>
  <FormItem :data="props.data" class="smart-date">
    <template #[dynamicSlot]="{ config, ui, icon, platForm }">
      <!--#if [PRODUCT]-->
      <ClientOnly>
        <component
          :is="dynamicDatePicker"
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
            <PhCalendar ref="dateIcon" size="16" class="text-orange-300" />
          </template>
        </component>
      </ClientOnly>
      <!--#endif-->
      <!--#if [LOWCODE]-->
      <component
        :is="dynamicDatePicker"
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
          <PhCalendar ref="dateIcon" size="16" class="text-orange-300" />
        </template>
      </component>
      <!--#endif-->
    </template>
  </FormItem>
</template>
<script setup lang="ts">
import { useTemplateRef, watch, computed, defineAsyncComponent, markRaw, onMounted } from 'vue'
import { PhCalendar } from '@phosphor-icons/vue'
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
const dateValue = defineModel({ default: '' })

const dynamicDatePicker = markRaw(
  defineAsyncComponent(() =>
    import('@vuepic/vue-datepicker').then((m) => {
      return m.VueDatePicker
    })
  )
)
type DatePickerInstance = InstanceType<typeof dynamicDatePicker>

const datePicker = useTemplateRef<DatePickerInstance>('datePicker')

const handleChange = (selectDate: any) => {
  // #if [PRODUCT]
  if (props.data.props.inTable) {
    emits('cell-change', selectDate)
  } else {
    emits('model-change', selectDate)
  }
  // #endif
}
watch(
  () => datePicker.value,
  (newVal) => {
    if (dynamicSlot.value === 'cellMain' && newVal) {
      newVal.openMenu()
    }
  },
  {
    immediate: true,
    deep: true,
  }
)
</script>
<style>
@import '@vuepic/vue-datepicker/dist/main.css';
</style>
