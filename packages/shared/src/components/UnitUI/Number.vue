<template>
  <FormItem :data="props.data" class="smart-number">
    <template #[dynamicSlot]="{ config, ui, icon, platForm }">
      <input
        v-model="numberValue"
        v-focus="config.focus"
        :class="[ui.uiStatic.input]"
        autocomplete="false"
        :placeholder="config.placeholder"
        :maxlength="config.maxLength"
        :disabled="config.disable"
        :readonly="platForm === 'lowcode' || config.readonly || config.tabStatus === 0"
        @change="handleChange"
      />
      <span v-if="config.clear || config.showIcon" :class="[ui.uiStatic.icon]">
        <!--#if [PRODUCT]-->
        <ClientOnly>
          <component :is="icon" weight="duotone" size="16" class="text-zinc-400 cursor-pointer" />
        </ClientOnly>
        <!--#endif-->
        <!--#if [LOWCODE]-->
        <component :is="icon" weight="duotone" size="16" class="text-zinc-400 cursor-pointer" />
        <!--#endif-->
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

const numberValue = defineModel()

const handleChange = () => {
  // #if [PRODUCT]
  if (props.data.props.inTable) {
    emits('cell-change', numberValue.value)
  } else {
    emits('model-change', numberValue.value)
  }
  // #endif
}
</script>
<style scoped></style>
