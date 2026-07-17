<template>
  <div class="p-unit flex flex-row items-center relative h-7 my-3 justify-between">
    <div v-show="data.name" class="mr-1" :class="{ 'w-20': data.single, 'w-7': !data.single }">
      {{ data.name }}
    </div>
    <div class="box flex-1 flex flex-row border border-solid border-zinc-300 rounded items-center">
      <div class="flex-1">
        <input type="text" class="px-1" :value="inputNumber" @keyup="keyUp" @change="change" />
      </div>
      <div v-show="unit" class="mr-1" @click="() => (showList = !showList)">{{ unit }}</div>
      <div class="flex flex-col border-l border-solid border-zinc-300 h-7 text-center">
        <span
          class="plus h-3.5 inline-block border-b border-solid border-zinc-300 cursor-pointer"
          @click="plus"
          ><PhCaretUp :size="12" weight="thin"
        /></span>
        <span class="minus h-3.5 inline-block cursor-pointer" @click="minus"
          ><PhCaretDown :size="12" weight="thin"
        /></span>
      </div>
    </div>
    <div
      v-show="unit && showList"
      class="absolute unit-list border border-solid border-zinc-300 rounded bg-white text-center"
    >
      <div
        v-for="(item, index) in unitList"
        :key="item.value"
        class="hover:bg-zinc-300"
        :class="{ 'border-t border-solid border-zinc-300': index > 0 }"
        @click.stop="selectUnit(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { PhCaretUp, PhCaretDown } from '@phosphor-icons/vue'
import { keyUp } from 'public-shared'
const emit = defineEmits(['change'])
const props = defineProps<{
  data: {
    name?: string
    unit?: string
    number?: number | string
    min?: number
    max?: number
    step?: number
    single?: boolean
  }
}>()
const unit = ref(props.data.unit)
const inputNumber = ref(props.data.number)
const unitList = ref([
  { name: 'px', value: 0 },
  { name: '%', value: 1 },
])
const showList = ref(false)
const selectUnit = function (item: any) {
  unit.value = item.name
  showList.value = false
  emit('change', { number: inputNumber })
}
const min = props.data.min || 0
const max = props.data.max || Number.MAX_VALUE
const step = props.data.step || 1
const plus = () => {
  if (inputNumber.value === undefined) return
  inputNumber.value = Number(Math.min(max, Number(inputNumber.value) + step).toFixed(2))
  emit('change', { number: inputNumber })
}
const minus = () => {
  if (inputNumber.value === undefined) return
  inputNumber.value = Number(Math.max(min, Number(inputNumber.value) - step).toFixed(2))
  emit('change', { number: inputNumber })
}
const change = (e: Event) => {
  const target = e.target as HTMLInputElement
  const v = target.value.trim().length > 0 ? Number(target.value) : ''
  emit('change', { number: v })
}
watch(
  () => props.data.number,
  (newVal) => {
    if (newVal) {
      const n = (newVal + '').replace('px', '')
      const v = n.trim().length > 0 ? Number(n) : ''
      inputNumber.value = v
    } else {
      inputNumber.value = ''
    }
  },
)
</script>
<style scoped>
.p-unit .box {
  width: 5.375rem;
}
.p-unit .plus,
.p-unit .minus {
  line-height: 0.875rem;
  width: 1.5rem;
}
.p-unit .unit-list {
  width: 3rem;
  top: 1.75rem;
  right: 1.5rem;
}
.p-unit input {
  width: 2.5rem;
}
</style>
