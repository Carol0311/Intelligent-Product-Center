<template>
  <FormItem :data="props.data" class="smart-checkbox">
    <template #[dynamicSlot]="{ ui, icon, checkIcon }">
      <span :class="[ui.uiStatic.checkIcon]" class="h-7 align-middle table-cell" @click="handleChange">
        <!--#if [PRODUCT]-->
        <ClientOnly>
          <PhCheckSquare v-if="checkboxValue" size="20" :class="[checkIcon]" class="text-orange-300" />
          <PhSquare v-else size="20" :class="[checkIcon]" class="text-orange-300" />
        </ClientOnly>
        <!--#endif-->
        <!--#if [LOWCODE]-->
        <PhCheckSquare v-if="checkboxValue" size="20" :class="[checkIcon]" class="text-orange-300" />
        <PhSquare v-else size="20" :class="[checkIcon]" class="text-orange-300" />
        <!--#endif-->
      </span>
    </template>
  </FormItem>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue'
import { PhSquare, PhCheckSquare } from '@phosphor-icons/vue'
import FormItem from '@shared/components/SlotUI/FormItem.vue'
import type { ComponentSchema, ColumnSchema } from '@shared/schema'

const emits = defineEmits(['model-change', 'cell-change'])

const props = defineProps<{
  data: ComponentSchema | ColumnSchema
}>()

const dynamicSlot = computed(() => {
  return props.data.props.inTable ? 'cellMain' : 'main'
})

const checkboxValue = defineModel({ default: false })

const handleChange = () => {
  // #if [PRODUCT]
  if (props.data.props.inTable) {
    emits('cell-change', !checkboxValue.value)
  } else {
    emits('model-change', !checkboxValue.value)
  }
  // #endif
}
</script>
<style scoped></style>
