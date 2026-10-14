<template>
  <div ref="editorRef" class="floating-editor border-0 px-2 bg-orange-100 flex items-center absolute" @click.stop>
    <component :is="editCom" :key="activeEditCell.editKey" :data="activeEditCell.component" v-model="cellValue" :instanceId="instanceId" :rowCode="rowCode" @cell-change="handleCellChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ColumnSchema } from '@shared/schema'
import { ComponentPool } from './core/ComponentPool'
import { componentRegistry } from '@shared/registry/componentRegistry'

const { get } = componentRegistry
//const { setComInstanceMap, getComInstance } = new ComponentPool()
const comPool = new ComponentPool()

const emits = defineEmits(['cell-editor-change'])

const props = defineProps<{
  activeEditCell: {
    rowCode?: any
    instanceId?: string
    rowId: number
    value: any
    editKey: string
    component: ColumnSchema
  }
}>()
const cellValue = ref<any>(null)
const instanceId = computed(() => props.activeEditCell.instanceId)
const rowCode = computed(() => props.activeEditCell.rowCode)

watch(
  () => props.activeEditCell.editKey,
  (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      cellValue.value = props.activeEditCell.value
    }
  },
  { immediate: true }
)

const editCom = computed(() => {
  const type = props.activeEditCell.component.type
  const existCom = comPool.getComInstance(type)
  if (!existCom) {
    const newCom = get(type)
    comPool.setComInstanceMap(`${type}`, newCom)
  }
  return comPool.getComInstance(type)
})

const handleCellChange = (params: any) => {
  cellValue.value = params
  emits('cell-editor-change', {
    rowId: props.activeEditCell.rowId,
    colKey: props.activeEditCell.component.key,
    value: cellValue.value,
  })
}
</script>

<style scoped>
.floating-editor {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
