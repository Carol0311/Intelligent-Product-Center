<template>
  <FoldAndOpen class="p-bg" :data="{ name: '背景' }">
    <PRadio :data="bgData" />
    <POpacity @change="(arg) => updateValue(arg, 'opacity')" />
  </FoldAndOpen>
</template>
<script setup lang="ts">
import type { Component } from 'vue'
import { ref, markRaw, inject } from 'vue'
import { PhPaintBucket, PhImageSquare } from '@phosphor-icons/vue'
import { PRadio, POpacity, FoldAndOpen } from './index'
interface ListItem {
  name: string | Component
  value: string
}
interface BgItem {
  name: string
  value?: string
  list: ListItem[]
}
const bgData = ref<BgItem>({
  name: '背景',
  list: [
    { name: markRaw(PhPaintBucket), value: 'background-color' },
    { name: markRaw(PhImageSquare), value: 'background-image' },
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
