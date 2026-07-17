<template>
  <div class="flex flex-col p-form-item">
    <div
      v-for="(child, index) in children"
      :key="child.id"
      class="flex flex-row items-center text-xs mb-2"
    >
      <div
        v-click-outside="() => (openSelectList = false)"
        class="flex flex-row items-center w-28 border border-solid border-zinc-300 rounded mr-2 leading-6 px-1 focus:border-orange-300 hover:border-orange-300"
        @click="(e) => toggleSelectList(e, index)"
      >
        <span class="flex-1">{{ child.props.name }}</span>
        <div class="text-zinc-500">
          <PhCaretDown v-show="!openSelectList" class="mb-1" :size="14" weight="light" />
          <PhCaretUp v-show="openSelectList" class="mb-1" :size="14" weight="light" />
        </div>
      </div>
      <input
        class="label-text w-28 border border-solid border-zinc-300 rounded leading-6 px-1 mr-2 focus:border-orange-300 hover:border-orange-300"
        type="text"
        :value="child.props.label"
        @change="(e) => handleChange(e, index)"
      />
      <PhTrash
        :size="16"
        weight="duotone"
        class="text-zinc-500 mr-1 cursor-pointer"
        @click="deleteComponent(child.id)"
      />
      <PhPen
        :size="16"
        weight="duotone"
        class="text-orange-300 cursor-pointer"
        @click="setSelectedComponent(child.id)"
      />
    </div>
    <div class="flex flex-row items-center text-orange-300 my-3" @click="addFormItem">
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
import { ref, inject, computed } from 'vue'
import { PhTrash, PhPen, PhPlus, PhCaretDown, PhCaretUp } from '@phosphor-icons/vue'
import { createNewComponent } from '@/domain/editor/treeManager'
import { useEditorStore } from '@/stores'
import { deepToRaw, vClickOutside } from 'public-shared'

const { deleteComponent, setSelectedComponent } = useEditorStore()

const model = defineModel<Record<string, any>>()
const propsChange = inject<{
  update: (isPage?: boolean, isSuperForm?: boolean, isReset?: boolean) => void
}>('propsChange')

const children = computed(() => {
  return model.value?.children
})
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

//切换当前表单项的类型
const selectItem = (type: any) => {
  if (childIndex !== null) {
    const newCom = createNewComponent(model.value?.id, type)
    const newModel = { ...model.value }
    newModel.children[childIndex] = newCom
    model.value = newModel
    propsChange?.update(false, true, true)
  }
}

//更改表单项label
const handleChange = (e: MouseEvent, index: number) => {
  const target = e.target as HTMLInputElement
  childIndex = index
  if (childIndex !== null) {
    const newModel = deepToRaw({ ...model.value })
    newModel.children[childIndex].props = {
      ...newModel.children[childIndex].props,
      label: target.value,
    }
    newModel.change = {
      cid: newModel.children[childIndex].props.cid,
      value: { label: target.value },
    }
    model.value = newModel
    propsChange?.update(false, true, false)
  }
}
//新增一项表单项，默认为Text输入框
const addFormItem = () => {
  const newDefaultCom = createNewComponent(model.value?.id, 'Text')
  const newModel = { ...model.value }
  newModel.children.push(newDefaultCom)
  model.value = newModel
  propsChange?.update(false, true, true)
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
  width: 7rem;
  height: 1.625rem;
}
.p-item-list {
  z-index: 9999999;
  width: 6.25rem;
}
</style>
