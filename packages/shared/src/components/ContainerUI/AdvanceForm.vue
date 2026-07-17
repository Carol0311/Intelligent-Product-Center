<template>
  <DynamicItem class="smart-advance-form grid gap-4 p-4 pb-0 bg-white" :data="data" />
</template>
<script lang="ts" setup>
import type { ComponentSchema } from '@shared/schema'
import DynamicItem from './DynamicItem.vue'

const props = defineProps<{
  data: ComponentSchema
}>()
</script>
<style scoped></style>
