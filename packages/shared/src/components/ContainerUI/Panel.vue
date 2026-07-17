<template>
  <DynamicItem class="small-panel grid" :data="data" />
</template>
<script setup lang="ts">
import DynamicItem from './DynamicItem.vue'
import type { ComponentSchema } from '@shared/schema'
const props = defineProps<{
  data: ComponentSchema
}>()
</script>
<style scoped></style>
