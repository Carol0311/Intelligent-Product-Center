<template>
  <FormItem :data="props.data" class="smart-radiogroup">
    <template #[dynamicSlot]="{ ui, icon, checkIcon }">
      <div class="flex flex-row items-center h-7">
        <span v-for="option in radioGroupValue" :key="option.name" :class="[ui.uiStatic.checkIcon]" class="h-7 align-middle table-cell cursor-pointer" @click="handleChange(option)">
          <!--#if [PRODUCT]-->
          <ClientOnly>
            <PhCheckCircle v-if="option.value" size="20" :class="[checkIcon]" class="smart-checkbox-icon inline-block leading-none" />
            <PhCircle v-else size="20" :class="[checkIcon]" class="smart-checkbox-icon inline-block leading-none" />
          </ClientOnly>
          <!--#endif-->
          <!--#if [LOWCODE]-->
          <PhCheckCircle v-if="option.value" size="20" :class="[checkIcon]" class="smart-checkbox-icon inline-block leading-none" />
          <PhCircle v-else size="20" :class="[checkIcon]" class="smart-checkbox-icon inline-block leading-none" />
          <!--#endif-->
          <span class="smart-checkbox-label align-middle mx-1 inline-block leading-none">{{ option.name }}</span>
        </span>
      </div>
    </template>
  </FormItem>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { PhCircle, PhCheckCircle } from '@phosphor-icons/vue'
import FormItem from '@shared/components/SlotUI/FormItem.vue'
import type { ComponentSchema, ColumnSchema } from '@shared/schema'

const emits = defineEmits(['model-change', 'cell-change'])

const props = defineProps<{
  data: ComponentSchema | ColumnSchema
}>()

const dynamicSlot = computed(() => {
  return props.data.props.inTable ? 'cellMain' : 'main'
})

const radioGroupValue = defineModel({
  default: [
    { name: '选项1', value: true },
    { name: '选项2', value: false },
  ],
})

const handleChange = (option: any) => {
  // #if [PRODUCT]
  const newGroup = radioGroupValue.value.map((o: any) => ({
    ...o,
    value: o.name === option.name,
  }))

  if (props.data.props.inTable) {
    emits('cell-change', newGroup)
  } else {
    emits('model-change', newGroup)
  }
  // #endif
}
</script>
<style scoped></style>
