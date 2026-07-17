<template>
  <RouterView />
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
// #if [LOWCODE]
console.log('this is lowcode')
// #endif

// #if [PRODUCT]
console.log('this is product')
// #endif

console.log('当前环境:', import.meta.env.VITE_USER_NODE_ENV)
</script>
<style scoped></style>
