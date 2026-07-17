<template>
  <FormItem :data="props.data" class="smart-price">
    <template #[dynamicSlot]="{ config, ui, icon, platForm }">
      <span class="table-cell bg-transparent align-middle w-4 text-center text-orange-300">¥</span>
      <input
        v-model="priceValue"
        v-focus="config.focus"
        :class="[ui.uiStatic.input]"
        class="price-input"
        autocomplete="false"
        :placeholder="config.placeholder"
        :maxlength="config.maxLength"
        :disabled="config.disable"
        :readonly="platForm === 'lowcode' || config.readonly || config.tabStatus === 0"
        @focus="ui.uiEvents.focus"
        @blur="ui.uiEvents.blur"
        @mouseover="ui.uiEvents.mouseOver"
        @mouseleave="ui.uiEvents.mouseLeave"
        @change="handleChange"
      />
      <span v-if="config.clear || config.showIcon" :class="[ui.uiStatic.icon]">
        <component :is="icon" weight="duotone" size="16" class="text-zinc-400 cursor-pointer" />
      </span>
    </template>
  </FormItem>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import FormItem from '@shared/components/SlotUI/FormItem.vue'
import { vFocus } from '@shared/plugins/CusDirectives'
import type { ComponentSchema, ColumnSchema } from '@shared/schema'

const emits = defineEmits(['model-change', 'cell-change'])

const props = defineProps<{
  data: ComponentSchema | ColumnSchema
}>()

const dynamicSlot = computed(() => {
  return props.data.props.inTable ? 'cellMain' : 'main'
})

const priceValue = defineModel()

const handleChange = () => {
  // #if [PRODUCT]
  if (props.data.props.inTable) {
    emits('cell-change', priceValue.value)
  } else {
    emits('model-change', priceValue.value)
  }
  // #endif
}
</script>
<style scoped>
.price-input {
  position: relative;
  margin-left: -1rem;
  left: 1rem;
}
</style>
