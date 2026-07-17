<template>
  <FoldAndOpen class="p-font" :data="{ name: '字体', open: true }">
    <div class="flex flex-row justify-between">
      <PUnit
        :data="{ name: '字号', unit: 'px' }"
        @change="(arg) => updateValue(arg, 'font-size')"
      />
      <PUnit
        :data="{ name: '行高', unit: 'px' }"
        @change="(arg) => updateValue(arg, 'line-height')"
      />
    </div>
    <PSelect
      :data="{ name: '字重', list: boldDatas }"
      @change="(arg) => updateValue(arg, 'font-weight')"
    />
    <PSelect
      :data="{ name: '字体', list: fontDatas }"
      @change="(arg) => updateValue(arg, 'font-family')"
    />
    <PColor
      :data="{ name: '文字颜色', color: '#333333' }"
      @change="(arg) => updateValue(arg, 'color')"
    />
    <PRadio :data="alignData" @change="(arg) => updateValue(arg, 'text-align')" />
    <POpacity @change="(arg) => updateValue(arg, 'opacity')" />
  </FoldAndOpen>
</template>
<script lang="ts" setup>
import type { Component } from 'vue'
import { ref, markRaw, inject } from 'vue'
import {
  PhTextAlignLeft,
  PhTextAlignRight,
  PhTextAlignCenter,
  PhTextAlignJustify,
} from '@phosphor-icons/vue'
import { PSelect, PUnit, PColor, POpacity, PRadio, FoldAndOpen } from './index'
interface ListItem {
  name: string | Component
  value: number | string
}
const boldDatas = ref<ListItem[]>([
  { name: '100 Thin', value: 100 },
  { name: '200 Extra Light', value: 200 },
  { name: '300 Light', value: 300 },
  { name: '400 Normal', value: 400 },
  { name: '500 Medium', value: 500 },
  { name: '600 Semi Bold', value: 600 },
  { name: '700 Bold', value: 700 },
  { name: 'Extra Bold', value: 'Extra Bold' },
  { name: 'Black', value: 'Black' },
])
const fontDatas = ref<ListItem[]>([
  { name: 'Helvetica', value: 1 },
  { name: 'Arial', value: 2 },
  { name: 'serif', value: 3 },
])
interface AlignItem {
  name: string
  value?: number | string
  list: ListItem[]
}
const alignData = ref<AlignItem>({
  name: '对齐',
  list: [
    { name: markRaw(PhTextAlignLeft), value: 'left' },
    { name: markRaw(PhTextAlignRight), value: 'center' },
    { name: markRaw(PhTextAlignCenter), value: 'right' },
    { name: markRaw(PhTextAlignJustify), value: 'justify' },
  ],
})
const model = defineModel<Record<string, any>>()
const propsChange = inject<{ update: () => void }>('propsChange')
//更新样式属性
const updateValue = (arg: any, p: string) => {
  const isUnit = arg.hasOwnProperty('number')
  let val = isUnit ? arg.number : arg.value
  val = p === 'font-weight' ? Number(val.replace(/\D/g, '')) : val
  if (val === '' && model.value?.hasOwnProperty(p)) {
    //替换引用的方式删除styleData---inlineStyle对象中的属性
    const newModel = { ...model.value }
    delete newModel[p]
    model.value = newModel
  } else {
    model.value = { ...model.value, [p]: isUnit ? `${arg.number}px` : val }
  }
  propsChange?.update()
}
</script>
<style scoped></style>
