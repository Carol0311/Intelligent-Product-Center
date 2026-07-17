<template>
  <div class="fold-and-open text-gray-500 mb-2.5 border border-zinc-300 rounded">
    <div class="head bg-gray-100 flex flex-row items-center p-2.5" @click="() => (open = !open)">
      <PhCaretRight v-show="!open" :size="16" weight="thin" />
      <PhCaretDown v-show="open" :size="16" weight="thin" />
      <div class="ml-1">{{ data.name }}</div>
    </div>
    <div v-show="open" class="body bg-white mt-2.5 mx-auto">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { PhCaretRight, PhCaretDown } from '@phosphor-icons/vue'
const props = defineProps<{
  data: {
    name: string
    open?: boolean
  }
}>()
const open = ref(props.data.open) || false
</script>
<style scoped>
.fold-and-open .body {
  width: 260px;
}
</style>
