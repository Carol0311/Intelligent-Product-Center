<template>
  <div class="p-number flex flex-row my-3 items-center">
    <div class="mr-1 w-20">
      <span>{{ name }}</span>
      <PhQuestion v-show="tips" :size="14" class="mb-0.5" />
    </div>
    <div class="flex-1 border border-solid border-zinc-300 rounded h-7 px-2">
      <input type="text" @keyup="keyUp" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { PhQuestion } from '@phosphor-icons/vue'
import { keyUp } from 'public-shared'
const name = ref('字段名称')
const tips = ref(true)
</script>
<style scoped></style>
