<template>
  <FormItem :data="props.data" class="smart-select">
    <template #main="{ config, ui, icon, platForm }" @click="toggleDropdown">
      <input
        :value="selectName"
        v-focus="config.focus"
        :class="[ui.uiStatic.input]"
        class="select-input"
        autocomplete="false"
        :placeholder="config.placeholder"
        :maxlength="config.maxLength"
        :disabled="config.disable"
        :readonly="platForm === 'lowcode' || config.readonly || config.tabStatus === 0"
      />
      <span :class="[ui.uiStatic.icon]">
        <component :is="icon" weight="duotone" size="16" class="text-orange-300 cursor-pointer" />
      </span>
    </template>
    <div v-show="showDropdown" class="select-dropdown fixed" :style="dropDownStyle">
      <ul>
        <li v-for="option in selectList" :key="option.value" @click="handleOptionClick(option)">
          {{ option.label }}
        </li>
      </ul>
    </div>
  </FormItem>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import FormItem from '@shared/components/SlotUI/FormItem.vue'
import { vFocus } from '@shared/plugins/CusDirectives'
import type { ComponentSchema, ColumnSchema } from '@shared/schema'

const emits = defineEmits(['model-change', 'cell-change'])

const showDropdown = ref(false)
const dropDownStyle = ref({})

const props = defineProps<{
  data: ComponentSchema | ColumnSchema
}>()

const selectValue = defineModel({ default: { label: '', value: '' } })

const selectName = computed(() => {
  return selectValue.value ? selectValue.value.label : ''
})

const selectList = ref([
  { label: '选项1', value: 'option1' },
  { label: '选项2', value: 'option2' },
  { label: '选项3', value: 'option3' },
])

const toggleDropdown = (e: MouseEvent) => {
  // #if [PRODUCT]
  const target = e.target as HTMLElement
  const rect = target.getBoundingClientRect()
  dropDownStyle.value = {
    top: `${rect.top}px`,
    left: `${rect.left}px`,
  }
  showDropdown.value = !showDropdown.value
  // #endif
}

const handleOptionClick = (option: any) => {
  // #if [PRODUCT]
  showDropdown.value = false
  if (props.data.props.inTable) {
    emits('cell-change', option)
  } else {
    emits('model-change', option)
  }
  // #endif
}
</script>
<style scoped>
.select-input {
  margin-right: -1.25rem;
}
</style>
