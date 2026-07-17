<template>
  <div class="p-color flex flex-row items-center h-7 my-3">
    <div v-show="data.name" class="mr-1 w-20">{{ data.name }}</div>
    <div class="flex flex-row flex-1 border border-zinc-300 rounded h-full items-center">
      <input
        ref="colorPicker"
        type="color"
        :value="curColor"
        class="w-6 h-6 rounded mr-1"
        @change="colorChange"
      />
      <input
        type="text"
        :value="curColor"
        class="flex-1 w-full h-full"
        :readonly="true"
        @click.prevent="openPicker"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
const emit = defineEmits(['change'])
const props = defineProps<{
  data: {
    name?: string
    color?: string
  }
}>()
const curColor = ref(props.data.color) || ref('#333333')
const colorPicker = ref<HTMLElement>()
const openPicker = function () {
  colorPicker.value?.click()
}
const colorChange = function (e: Event) {
  curColor.value = (e.target as HTMLInputElement).value
  emit('change', { value: curColor.value })
}
watch(
  () => props.data.color,
  (newVal) => {
    curColor.value = newVal
  },
)
</script>
<style scoped></style>
