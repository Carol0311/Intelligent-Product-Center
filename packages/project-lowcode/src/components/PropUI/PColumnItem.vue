<template>
  <div class="flex flex-col p-column-item">
    <div
      v-for="(col, index) in column"
      :key="col.key"
      class="flex flex-row items-center text-xs mb-2 justify-between"
    >
      <div class="flex flex-1">
        <input
          class="label-text border border-solid border-zinc-300 rounded leading-6 px-1 mr-2 focus:border-orange-300 hover:border-orange-300"
          :class="{ 'flex-1': isSystem, 'w-14': !isSystem }"
          type="text"
          :value="col.name"
          @change="(e) => handleChange(e, index, 'name')"
        />
        <template v-if="!isSystem">
          <input
            class="label-text border w-14 border-solid border-zinc-300 rounded leading-6 px-1 mr-2 focus:border-orange-300 hover:border-orange-300"
            type="text"
            :value="col.key"
            @change="(e) => handleChange(e, index, 'key')"
          />
          <div
            v-click-outside="() => (openSelectList = false)"
            class="flex flex-row items-center w-14 border border-solid border-zinc-300 rounded mr-2 leading-6 px-1 focus:border-orange-300 hover:border-orange-300"
            @click="(e) => toggleSelectList(e, index)"
          >
            <span class="flex-1">{{ col.type }}</span>
            <div class="text-zinc-500">
              <PhCaretDown v-show="!openSelectList" class="mb-1" :size="14" weight="light" />
              <PhCaretUp v-show="openSelectList" class="mb-1" :size="14" weight="light" />
            </div>
          </div>
        </template>
      </div>
      <div>
        <PhArrowCircleLeft
          :size="16"
          weight="duotone"
          class="mr-1"
          :class="{
            'opacity-30 cursor-not-allowed': index === 0,
            'text-orange-300 cursor-pointer': index > 0,
          }"
          @click="() => handleMoveColumn(col.key, -1)"
        />
        <PhArrowCircleRight
          :size="16"
          weight="duotone"
          :class="{
            'opacity-30 cursor-not-allowed': index === column.length - 1,
            'text-orange-300 cursor-pointer': index < column.length - 1,
          }"
          @click="() => handleMoveColumn(col.key, 1)"
        />
        <PhTrash
          v-if="!isSystem"
          :size="16"
          weight="duotone"
          class="text-zinc-500 mr-1 cursor-pointer"
          @click="() => handleDeleteColumn(col.key)"
        />
      </div>
    </div>
    <div
      v-if="!isSystem"
      class="flex flex-row items-center text-orange-300 my-3"
      @click="addFormItem"
    >
      <div>添加一项</div>
      <PhPlus :size="16" weight="light" />
    </div>
    <div
      v-show="openSelectList"
      class="p-item-list h-48 p-2 fixed bg-white shadow overflow-auto"
      :style="listStyle"
    >
      <div v-for="item in itemList" :key="item.type" class="p-1" @click="selectItem(item.type)">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { inject, computed, ref } from 'vue'
import {
  PhArrowCircleLeft,
  PhArrowCircleRight,
  PhTrash,
  PhCaretDown,
  PhCaretUp,
  PhPlus,
} from '@phosphor-icons/vue'
import { useTableStore } from '@/stores'
import { COMPONENT_DEFAULT_PROPS, generateUniqueId, vClickOutside } from 'public-shared'
import type { ComponentType, ColumnSchema } from 'public-shared'

const { getCurrentColumn, setColumn } = useTableStore()

const props = defineProps<{
  instanceId: string
  tableId: string
  pageId: string
  isSystem: boolean
}>()

const column = computed(() => {
  return getCurrentColumn(props.tableId) || []
})
//更改表单项label
const handleChange = (e: MouseEvent, index: number, field: string) => {
  const target = e.currentTarget as HTMLInputElement
  const new_column = column.value.map((col: any, i: number) => {
    if (i === index) {
      col[field] = target.value
    }
    return col
  })
  setColumn(props.tableId, new_column, {
    instanceId: props.instanceId,
    tableId: props.tableId,
    pageId: props.pageId,
  })
}

// 移动列
const handleMoveColumn = (key: string, direction: number) => {
  const new_column = [...column.value]
  const index = new_column.findIndex((col: any) => col.key === key)
  if (index !== -1) {
    new_column.splice(index, 1)
    const targetIndex = Math.max(0, Math.min(column.value.length - 1, index + direction))
    if (targetIndex === index) return
    new_column.splice(targetIndex, 0, column.value[index])
    setColumn(props.tableId, new_column, {
      instanceId: props.instanceId,
      tableId: props.tableId,
      pageId: props.pageId,
    })
  }
}

// 删除列
const handleDeleteColumn = (key: string) => {
  const new_column = column.value.filter((col: any) => col.key !== key)
  setColumn(props.tableId, new_column, {
    instanceId: props.instanceId,
    tableId: props.tableId,
    pageId: props.pageId,
  })
}

let childIndex: number | null = null
const openSelectList = ref(false)
const listStyle = ref({})

//切换表单项类型选择列表
const toggleSelectList = (e: MouseEvent, index: number) => {
  childIndex = index
  openSelectList.value = !openSelectList.value
  const rect = (e.target as HTMLElement).getBoundingClientRect()
  const isUp = rect.top + 192 > document.body.clientHeight - 50
  listStyle.value = {
    top: isUp ? `${rect.top - 192}px` : `${rect.top + rect.height + 1}px`,
    left: `${rect.left - 5}px`,
  }
}

const createNewColumn = (type: ComponentType): ColumnSchema => {
  const newCom: ColumnSchema = {
    instanceId: props.instanceId,
    name: '列名称',
    type,
    key: '关联key',
    props: { ...COMPONENT_DEFAULT_PROPS, inTable: true },
  }
  return newCom
}

//切换当前表单项的类型
const selectItem = (type: any) => {
  if (childIndex !== null) {
    const newCom = createNewColumn(type)
    const new_column = [...column.value]
    new_column[childIndex] = {
      ...column.value[childIndex],
      type: newCom.type,
      props: newCom.props,
    }
    setColumn(props.tableId, new_column, {
      instanceId: props.instanceId,
      tableId: props.tableId,
      pageId: props.pageId,
    })
  }
}

//新增一项表单项，默认为Text输入框
const addFormItem = () => {
  const newDefaultCom = createNewColumn('Text')
  const new_column = [...column.value, newDefaultCom]
  setColumn(props.tableId, new_column, {
    instanceId: props.instanceId,
    tableId: props.tableId,
    pageId: props.pageId,
  })
}

const itemList = [
  { type: 'Text', name: '输入框' },
  { type: 'TextArea', name: '文本输入框' },
  { type: 'Number', name: '数字输入框' },
  { type: 'Price', name: '价格输入框' },
  { type: 'Qty', name: '数量输入框' },
  { type: 'Text', name: '密码框' },
  { type: 'Date', name: '日期选择框' },
  { type: 'DateRange', name: '日期区间' },
  { type: 'Radio', name: '单选按钮' },
  { type: 'RadioGroup', name: '单选按钮组' },
  { type: 'SCheckbox', name: '复选按钮' },
  { type: 'CheckboxGroup', name: '复选按钮组' },
  { type: 'Address', name: '地址级联' },
  { type: 'Switch', name: '开关组件' },
  { type: 'SSelect', name: '下拉选择器' },
  { type: 'Upload', name: '上传组件' },
]
</script>
<style scoped>
input.label-text:focus {
  border: 1px solid rgb(253 186 116 / var(--tw-text-opacity, 1));
  width: 3.5rem;
  height: 1.625rem;
}
</style>
