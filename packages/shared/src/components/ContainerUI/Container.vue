<template>
  <DynamicItem class="small-container grid gap-4" :data="data" />
</template>
<script setup lang="ts">
import type { ComponentSchema } from '@shared/schema'
import DynamicItem from './DynamicItem.vue'

const props = defineProps<{
  data: ComponentSchema
}>()
</script>
<style>
.small-container {
  min-height: max-content;
  gap: 0.5rem;
}
.small-container .empty-placeholder {
  width: 100%;
  height: 100%;
  text-align: center;
}
.small-container .container-devider {
  left: 0;
  top: 0;
  z-index: 100000;
}
</style>
