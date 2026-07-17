<template>
  <div class="bottom-tips text-center">
    <div v-if="errTip" class="error-tip text-red-400">{{ errTip }}</div>
    <div v-if="helpTip" class="help-tip text-orange-300">{{ helpTip }}</div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  errTip?: string
  helpTip?: string
}>()
</script>
<style scoped></style>
