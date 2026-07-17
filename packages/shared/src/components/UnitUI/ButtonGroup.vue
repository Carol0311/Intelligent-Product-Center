<template>
  <div class="text-white flex flex-row smart-button-group">
    <div class="bg-orange-300 rounded-xl w-20 leading-6 text-center mr-5">提交</div>
    <div class="bg-zinc-300 rounded-xl w-20 leading-6 text-center">取消</div>
  </div>
</template>
<script setup lang="ts">
import { useUiConfig } from '@shared/composables/useUiConfig'
import type { ComponentSchema } from '@shared/schema'

const props = defineProps<{
  data: ComponentSchema
}>()
const ui = useUiConfig(props.data.id)
</script>
