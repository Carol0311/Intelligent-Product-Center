<template>
  <FoldAndOpen class="p-border" :data="{ name: '边框', open: false }">
    <PRadio :data="radiusData" @change="(arg) => updateValue(arg, 'border-radius')" />
    <div class="p-border-box text-gray-500 flex flex-row my-3 items-center relative">
      <div class="mr-1 w-20">
        <span>边框</span>
      </div>
      <div class="border-box flex items-center relative">
        <span
          v-for="i in [0, 1, 2, 3, 4]"
          :key="i"
          :style="{ ...borderDatas[i], borderWidth: borderDatas[i].borderWidth + 'px' }"
          :class="{
            'border-dotted': i !== 1,
            left: i == 0,
            'border-solid': i == 1,
            right: i === 2,
            top: i === 3,
            bottom: i == 4,
            absolute: i > 2,
          }"
          @click="borderEvt($event, i)"
        ></span>
      </div>
      <div v-show="selectBorder" class="absolute bg-white select-border">
        <PUnit :data="borderWidth" @change="(arg) => updateValue(arg, 'width')" />
        <PColor :data="borderColor" @change="(arg) => updateValue(arg, 'color')" />
        <PSelect :data="borderStyle" @change="(arg) => updateValue(arg, 'style')" />
      </div>
    </div>
    <!--<div class="p-shadow-box text-gray-500 my-3">
      <PRadio :data="shadowData" />
      <PColor :data="shadowColor" />
      <div class="flex flex-row justify-between">
        <PUnit :data="{ name: 'x', number: 0, unit: 'px' }" />
        <PUnit :data="{ name: 'y', number: 0, unit: 'px' }" />
      </div>
      <div class="flex flex-row justify-between">
        <PUnit :data="{ name: '模糊', number: 0, unit: 'px' }" />
        <PUnit :data="{ name: '扩展', number: 0, unit: 'px' }" />
      </div>
    </div>-->
  </FoldAndOpen>
</template>
<script setup lang="ts">
import type { Component } from 'vue'
import { ref, markRaw, inject } from 'vue'
import {
  PhRectangle,
  PhRectangleDashed,
  /**PhSubtractSquare,
  PhImagesSquare,*/
} from '@phosphor-icons/vue'
import { PRadio, PUnit, PColor, PSelect, FoldAndOpen } from './index'
const selectBorder = ref(false)
const active = ref(0)
interface ListItem {
  name: string | Component
  value: string
}
interface BgItem {
  name: string
  value?: string
  list: ListItem[]
}
const radiusData = ref<BgItem>({
  name: '圆角',
  list: [
    { name: markRaw(PhRectangle), value: 'background-color' },
    { name: markRaw(PhRectangleDashed), value: 'background-image' },
  ],
})
/**const shadowData = ref<BgItem>({
  name: '阴影',
  list: [
    { name: markRaw(PhSubtractSquare), value: '外阴影' },
    { name: markRaw(PhImagesSquare), value: '内阴影' },
  ],
})
//阴影颜色
const shadowColor = ref({
  name: '阴影颜色',
})*/
const borderWidth = ref({
  number: 1,
})
const borderColor = ref({
  color: '',
})
const borderStyle = ref<BgItem>({
  name: '',
  value: '',
  list: [
    { name: 'solid', value: 'solid' },
    { name: 'dotted', value: 'dotted' },
    { name: 'dashed', value: 'dashed' },
  ],
})
interface BorderData {
  borderWidth?: number
  borderColor?: string
  borderStyle?: string
}
const borderDatas = ref<BorderData[]>([
  { borderWidth: 1, borderColor: '#333333', borderStyle: '' },
  { borderWidth: 1, borderColor: '#333333', borderStyle: '' },
  { borderWidth: 1, borderColor: '#333333', borderStyle: '' },
  { borderWidth: 1, borderColor: '#333333', borderStyle: '' },
  { borderWidth: 1, borderColor: '#333333', borderStyle: '' },
])
const borderEvt = (e: Event, index: number) => {
  e.stopPropagation()
  active.value = index
  const current = borderDatas.value[index]
  if (current.borderWidth !== undefined) {
    borderWidth.value.number = current.borderWidth
  }
  if (current.borderColor !== undefined) {
    borderColor.value.color = current.borderColor
  }
  if (current.borderStyle !== undefined) {
    borderStyle.value.value = current.borderStyle
  }
  selectBorder.value = true
}
const model = defineModel<Record<string, any>>()
const propsChange = inject<{ update: () => void }>('propsChange')
//更新边框样式属性 0--border-left 1--border 2--border-right 3--border-top 4--border-bottom
const borders = ['border-left', 'border', 'border-right', 'border-top', 'border-bottom']
const op = ref<Record<string, any>>({})
const updateValue = (arg: any, p: string) => {
  const fp = `${borders[active.value]}`
  if (p === 'width') {
    borderDatas.value[active.value].borderWidth = arg.number
    op.value = {
      [`${fp}-width`]: `${arg.number}px`,
      [`${fp}-style`]: borderDatas.value[active.value].borderStyle,
      [`${fp}-color`]: borderDatas.value[active.value].borderColor,
    }
  }
  if (p === 'color') {
    borderDatas.value[active.value].borderColor = arg.value
    borderColor.value.color = arg.value
    op.value = {
      [`${fp}-color`]: arg.value,
      [`${fp}-style`]: borderDatas.value[active.value].borderStyle,
      [`${fp}-width`]: borderDatas.value[active.value].borderWidth + 'px',
    }
  }
  if (p === 'style') {
    borderDatas.value[active.value].borderStyle = arg.value
    op.value = {
      [`${fp}-style`]: arg.value,
      [`${fp}-width`]: borderDatas.value[active.value].borderWidth + 'px',
      [`${fp}-color`]: borderDatas.value[active.value].borderColor,
    }
  }
  const isUnit = arg.hasOwnProperty('number')
  const val = isUnit ? arg.number : arg.value
  if (val === '' && model.value?.hasOwnProperty(p)) {
    //替换引用的方式删除styleData---inlineStyle对象中的属性
    const newModel = { ...model.value }
    delete newModel[p]
    model.value = newModel
  } else {
    model.value = { ...model.value, ...op.value }
  }
  propsChange?.update()
}
</script>
<style scoped>
.border-box {
  height: 150px;
}
.border-box span {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border-color: #333333;
  border-width: 1px;
  margin-right: 4px;
  cursor: pointer;
}
.border-box span.left {
  border-left: 1px solid #333333;
}
.border-box span.right {
  border-right: 1px solid #333333;
}
.border-box span.top {
  top: 42px;
  left: 24px;
  border-top: 1px solid #333333;
}
.border-box span.bottom {
  top: 88px;
  left: 24px;
  border-bottom: 1px solid #333333;
}
.select-border {
  z-index: 1;
  width: 80px;
  right: 0;
}
</style>
