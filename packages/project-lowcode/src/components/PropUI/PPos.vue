<template>
  <FoldAndOpen class="p-pos" :data="{ name: '位置' }">
    <PSelect :data="posData" @change="(arg) => updateValue(arg, 'position')" />
    <PUnit
      :data="{ name: 'zIndex', single: true }"
      @change="(arg) => updateValue(arg, 'z-index')"
    />
    <PRadio :data="floatData" @change="(arg) => updateValue(arg, 'float')" />
    <PRadio :data="clearData" @change="(arg) => updateValue(arg, 'clear')" />
  </FoldAndOpen>
</template>
<script setup lang="ts">
import type { Component } from 'vue'
import { ref, markRaw, inject } from 'vue'
import {
  PhX,
  PhAlignLeft,
  PhAlignRight,
  PhAlignCenterHorizontal,
  PhTextAlignLeft,
  PhTextAlignRight,
} from '@phosphor-icons/vue'
import { PRadio, PSelect, PUnit, FoldAndOpen } from './index'
interface ListItem {
  name: string | Component
  value: string
}
interface Item {
  name: string
  value?: string
  list: ListItem[]
}
const posData = ref<Item>({
  name: '定位',
  list: [
    { name: 'static', value: 'static' },
    { name: 'relative', value: 'realtive' },
    { name: 'absolute', value: 'absolute' },
    { name: 'fixed', value: 'fixed' },
    { name: 'sticky', value: 'sticky' },
  ],
})
const floatData = ref<Item>({
  name: '浮动方向',
  list: [
    { name: markRaw(PhX), value: 'none' },
    { name: markRaw(PhAlignLeft), value: 'left' },
    { name: markRaw(PhAlignRight), value: 'right' },
  ],
})
const clearData = ref<Item>({
  name: '清除',
  list: [
    { name: markRaw(PhX), value: 'none' },
    { name: markRaw(PhTextAlignLeft), value: 'left' },
    { name: markRaw(PhTextAlignRight), value: 'right' },
    { name: markRaw(PhAlignCenterHorizontal), value: 'center' },
  ],
})
const model = defineModel<Record<string, any>>()
const propsChange = inject<{ update: () => void }>('propsChange')
//更新样式属性
const updateValue = (arg: any, p: string) => {
  if (arg.value === '' && model.value?.hasOwnProperty(p)) {
    //替换引用的方式删除styleData---inlineStyle对象中的属性
    const newModel = { ...model.value }
    delete newModel[p]
    model.value = newModel
  } else {
    model.value = { ...model.value, [p]: arg.value }
  }
  propsChange?.update()
}
</script>
<style scoped></style>
