<template>
  <div class="s-header flex flex-row bg-white items-center pl-3 pr-4 py-2 bg-white text-base text-zinc-700">
    智能商品中心
    <PhPawPrint :size="24" weight="duotone" class="pl-1 text-orange-500" />
  </div>
</template>
<style scoped>
.s-header {
  height: 48px;
}
</style>
<script setup lang="ts">
import { PhPawPrint } from '@phosphor-icons/vue'
</script>
