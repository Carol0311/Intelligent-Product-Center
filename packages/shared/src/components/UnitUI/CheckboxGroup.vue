<template>
  <FormItem :data="props.data" class="smart-checkboxgroup">
    <template #[dynamicSlot]="{ icon, checkIcon }">
      <div class="flex flex-row items-center h-7">
        <span v-for="option in checkGroupValue" :key="option.name" class="cursor-pointer" @click="handleChange(option)">
          <!--#if [PRODUCT]-->
          <ClientOnly>
            <PhCheckSquare v-if="option.value" size="20" :class="[checkIcon]" class="smart-checkbox-icon inline-block leading-none" />
            <PhSquare v-else size="20" :class="[checkIcon]" class="smart-checkbox-icon inline-block leading-none" />
          </ClientOnly>
          <!--#endif-->
          <!--#if [LOWCODE]-->
          <PhCheckSquare v-if="option.value" size="20" :class="[checkIcon]" class="smart-checkbox-icon inline-block leading-none" />
          <PhSquare v-else size="20" :class="[checkIcon]" class="smart-checkbox-icon inline-block leading-none" />
          <!--#endif-->
          <span class="smart-checkbox-label align-middle mx-1 inline-block leading-none">{{ option.name }}</span>
        </span>
      </div>
    </template>
  </FormItem>
</template>
<script setup lang="ts">
import { computed } from 'vue'
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

const checkGroupValue = defineModel({
  default: [
    { name: '选项1', value: true },
    { name: '选项2', value: false },
    { name: '选项3', value: true },
  ],
})

const handleChange = (option: any) => {
  // #if [PRODUCT]
  option.value = !option.value
  const newGroup = checkGroupValue.value.map((o: any) => ({
    ...o,
    value: o.name === option.name ? option.value : o.value,
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
