<template>
  <FormItem :data="props.data" class="smart-textarea">
    <template #main="{ config, ui, icon, platForm }">
      <textarea
        v-model="textValue"
        v-focus="config.focus"
        type="text"
        :class="[ui.uiStatic.input]"
        class="py-2 textarea-box"
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
import FormItem from '@shared/components/SlotUI/FormItem.vue'
import { vFocus } from '@shared/plugins/CusDirectives'
import type { ComponentSchema, ColumnSchema } from '@shared/schema'

const emits = defineEmits(['model-change', 'cell-change'])

const props = defineProps<{
  data: ComponentSchema | ColumnSchema
}>()

const textValue = defineModel({ default: '' })

const handleChange = () => {
  // #if [PRODUCT]
  if (props.data.props.inTable) {
    emits('cell-change', textValue.value)
  } else {
    emits('model-change', textValue.value)
  }
  // #endif
}
</script>
<style scoped>
.textarea-box {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}
</style>
