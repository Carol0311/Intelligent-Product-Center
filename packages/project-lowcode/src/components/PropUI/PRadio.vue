<template>
  <div class="p-radio flex flex-row my-3 items-center">
    <div class="mr-1 w-20">
      <span>{{ data.name }}</span>
      <PhQuestion v-show="tips" :size="14" class="mb-0.5" />
    </div>
    <div
      class="flex-1 flex flex-row border border-solid border-zinc-300 rounded"
      :class="{ 'flex-wrap': data.wrap }"
    >
      <div
        v-for="item in data.list"
        :key="item.value"
        class="item flex-1 px-2 h-7 leading-7 border-l border-solid border-zinc-300 text-center hover:bg-orange-300"
        :class="{ 'border-b': data.wrap, 'bg-orange-300 text-white': select === item.value }"
        @click="changeEvt(item)"
      >
        <template v-if="typeof item.name === 'string'">
          {{ item.name }}
        </template>
        <component :is="item.name" v-else />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Component } from 'vue'
import { ref, watch, inject } from 'vue'
import { PhQuestion } from '@phosphor-icons/vue'
const emit = defineEmits(['change'])
const tips = ref(false)
interface ListItem {
  name: string | Component
  value: number | string
}
defineProps<{
  data: {
    name: string
    list: ListItem[]
    wrap?: boolean
  }
}>()
const propsChange = inject<{ update: () => void }>('propsChange')
const model = defineModel<number | string>()
const select = ref(model.value)
const changeEvt = (item: any) => {
  model.value = item.value
  propsChange?.update()
  emit('change', { value: item.value })
}
watch(
  () => model.value,
  (newVal) => {
    select.value = newVal
  },
)
</script>
<style scoped>
.p-radio .item:nth-child(1) {
  border-left: none;
}
.p-radio .flex-wrap .item:nth-child(4) {
  border-left: none;
  border-bottom: none;
}
</style>
