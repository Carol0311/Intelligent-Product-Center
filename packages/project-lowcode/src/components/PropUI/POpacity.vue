<template>
  <div ref="opacityRef" class="p-opacity my-3 flex -felx-row items-center">
    <div>{{ name }}</div>
    <div class="flex-1 flex flex-row items-center">
      <div ref="progressRef" class="line bg-gray-200 mx-1 flex-1 relative" @click="tracePos">
        <div
          class="opacity-number absolute bg-orange-300"
          :style="{ width: distance + 'px' }"
        ></div>
        <span
          :style="{ left: distance + 'px' }"
          class="bg-white absolute border border-orange-300"
          @mousedown="dragEvt"
          @touchstart.passive="dragEvt"
        ></span>
      </div>
      <PUnit :data="opacityData" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { PUnit } from './index'
const emit = defineEmits(['change'])
const name = ref('透明度')
interface OpacityItem {
  number?: number
  name?: string
  unit?: string
  min?: number
  max?: number
  step?: number
}
const opacityData = ref<OpacityItem>({
  min: 0,
  max: 1,
  step: 0.1,
})
const opacityRef = ref<HTMLElement>()
const progressRef = ref<HTMLElement>()
const isDraging = ref(false)
const distance = ref(0)
const updateValue = (clientX: number) => {
  if (!progressRef.value) return
  const pos = progressRef.value?.getBoundingClientRect()
  //拖拽进度条样式
  distance.value = Math.max(0, Math.min(pos.width - 10, clientX - pos.left))
  //拖拽像素位置转透明度系数
  const percentage = Math.max(0, Math.min(1, (clientX - pos.left) / (pos.width - 10)))
  //更新透明度值
  opacityData.value.number = percentage
  emit('change', { value: percentage })
}
//拖拽透明度进度条
const moveHandler = function (e: MouseEvent | TouchEvent) {
  if (!isDraging.value) return
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  updateValue(clientX)
}
const upHandler = () => {
  if (!opacityRef.value) return
  isDraging.value = false
  opacityRef.value.removeEventListener('mousemove', moveHandler as EventListener)
  opacityRef.value.removeEventListener('touchmove', moveHandler as EventListener)
  opacityRef.value.removeEventListener('mouseup', upHandler)
  opacityRef.value.removeEventListener('touchend', upHandler)
}
const dragEvt = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  e.stopPropagation()
  if (!opacityRef.value) return
  isDraging.value = true
  opacityRef.value.addEventListener('mousemove', moveHandler as EventListener)
  opacityRef.value.addEventListener('touchmove', moveHandler as EventListener)
  opacityRef.value.addEventListener('mouseup', upHandler)
  opacityRef.value.addEventListener('touchend', upHandler)
}
const tracePos = (e: MouseEvent | TouchEvent) => {
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  updateValue(clientX)
}
onUnmounted(() => {
  if (!opacityRef.value) return
  opacityRef.value.removeEventListener('mousemove', () => {})
  opacityRef.value.removeEventListener('touchmove', () => {})
  opacityRef.value.removeEventListener('mouseup', () => {})
  opacityRef.value.removeEventListener('touchend', () => {})
})
</script>
<style scoped>
.line {
  height: 4px;
}
.line span {
  border-radius: 100%;
  width: 14px;
  height: 14px;
  top: -4px;
}
.opacity-number {
  height: 4px;
}
</style>
