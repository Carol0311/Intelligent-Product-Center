<template>
  <FormItem :data="props.data" class="smart-radio">
    <template #[dynamicSlot]="{ ui, icon, checkIcon }">
      <span :class="[ui.uiStatic.checkIcon]" class="h-7 align-middle table-cell">
        <!--#if [PRODUCT]-->
        <ClientOnly>
          <PhCheckCircle v-if="radioValue" size="20" :class="[checkIcon]" class="text-orange-300" />
          <PhCircle v-else size="20" :class="[checkIcon]" class="text-orange-300" />
        </ClientOnly>
        <!--#endif-->
        <!--#if [LOWCODE]-->
        <PhCheckCircle v-if="radioValue" size="20" :class="[checkIcon]" class="text-orange-300" />
        <PhCircle v-else size="20" :class="[checkIcon]" class="text-orange-300" />
        <!--#endif-->
      </span>
    </template>
  </FormItem>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { PhCircle, PhCheckCircle } from '@phosphor-icons/vue'
import FormItem from '@shared/components/SlotUI/FormItem.vue'
import type { ComponentSchema, ColumnSchema } from '@shared/schema'

const props = defineProps<{
  data: ComponentSchema | ColumnSchema
}>()
const dynamicSlot = computed(() => {
  return props.data.props.inTable ? 'cellMain' : 'main'
})

const radioValue = defineModel({ default: false })
</script>
<style scoped></style>
