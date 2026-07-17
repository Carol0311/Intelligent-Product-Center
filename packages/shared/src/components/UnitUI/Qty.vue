<template>
  <FormItem :data="props.data" class="smart-qty">
    <template #[dynamicSlot]="{ config, ui, platForm }">
      <span class="table-cell bg-orange-300 align-middle text-center w-7 cursor-pointer" @click="handleMinus">
        <!--#if [PRODUCT]-->
        <ClientOnly>
          <PhMinus size="16" class="text-white inline" />
        </ClientOnly>
        <!--#endif-->
        <!--#if [LOWCODE]-->
        <PhMinus size="16" class="text-white inline" />
        <!--#endif-->
      </span>
      <input
        v-model="qtyValue"
        v-focus="config.focus"
        :class="[ui.uiStatic.input]"
        class="qty-input"
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
      <span class="table-cell bg-orange-300 align-middle text-center w-7 cursor-pointer" @click="handlePlus">
        <!--#if [PRODUCT]-->
        <ClientOnly>
          <PhPlus size="16" class="text-white inline" />
        </ClientOnly>
        <!--#endif-->
        <!--#if [LOWCODE]-->
        <PhPlus size="16" class="text-white inline" />
        <!--#endif-->
      </span>
    </template>
  </FormItem>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import FormItem from '@shared/components/SlotUI/FormItem.vue'
import { PhPlus, PhMinus } from '@phosphor-icons/vue'
import { vFocus } from '@shared/plugins/CusDirectives'
import type { ComponentSchema, ColumnSchema } from '@shared/schema'

const emits = defineEmits(['model-change', 'cell-change'])
const props = defineProps<{
  data: ComponentSchema | ColumnSchema
}>()

const dynamicSlot = computed(() => {
  return props.data.props.inTable ? 'cellMain' : 'main'
})

const qtyValue = defineModel()

const handlePlus = () => {
  // #if [PRODUCT]
  qtyValue.value = Number(qtyValue.value || 0) + 1
  handleChange()
  // #endif
}

const handleMinus = () => {
  // #if [PRODUCT]
  qtyValue.value = Number(qtyValue.value || 0) - 1
  handleChange()
  // #endif
}

const handleChange = () => {
  // #if [PRODUCT]
  if (props.data.props.inTable) {
    emits('cell-change', qtyValue.value)
  } else {
    emits('model-change', qtyValue.value)
  }
  // #endif
}
</script>
<style scoped>
.qty-input {
  margin-left: -1.75rem;
  margin-right: -1.75rem;
  left: 1.75rem;
  position: relative;
}
</style>
