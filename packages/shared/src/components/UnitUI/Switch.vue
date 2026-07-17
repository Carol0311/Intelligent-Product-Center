<template>
  <FormItem :data="props.data" class="smart-switch">
    <template #[dynamicSlot]="{ ui, icon, checkIcon }">
      <span :class="[ui.uiStatic.checkIcon]" class="h-7 align-middle table-cell" @click="handleChange">
        <!--#if [PRODUCT]-->
        <ClientOnly>
          <PhToggleRight v-if="switchValue" size="24" :class="[checkIcon]" weight="fill" class="text-orange-300 right" />
          <PhToggleLeft v-else size="24" :class="[checkIcon]" weight="fill" class="text-zinc-300 left" />
        </ClientOnly>
        <!--#endif-->
        <!--#if [LOWCODE]-->
        <PhToggleRight v-if="switchValue" size="24" :class="[checkIcon]" weight="fill" class="text-orange-300 right" />
        <PhToggleLeft v-else size="24" :class="[checkIcon]" weight="fill" class="text-zinc-300 left" />
        <!--#endif-->
      </span>
    </template>
  </FormItem>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { PhToggleLeft, PhToggleRight } from '@phosphor-icons/vue'
import FormItem from '@shared/components/SlotUI/FormItem.vue'
import type { ComponentSchema, ColumnSchema } from '@shared/schema'

const emits = defineEmits(['model-change', 'cell-change'])

const props = defineProps<{
  data: ComponentSchema | ColumnSchema
}>()

const dynamicSlot = computed(() => {
  return props.data.props.inTable ? 'cellMain' : 'main'
})

const switchValue = defineModel({ default: false })

const handleChange = () => {
  // #if [PRODUCT]
  if (props.data.props.inTable) {
    emits('cell-change', !switchValue.value)
  } else {
    emits('model-change', !switchValue.value)
  }
  // #endif
}
</script>
<style scoped></style>
