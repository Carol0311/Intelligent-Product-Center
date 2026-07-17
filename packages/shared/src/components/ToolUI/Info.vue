<template>
  <div class="short-info flex flex-row h-7 items-center px-3 w-52 bg-white absolute mt-7">
    <!--#if [PRODUCT]-->
    <ClientOnly>
      <PhCheckCircle v-if="data.success" :size="24" weight="light" class="text-lime-500" />
      <PhXCircle v-if="!data.success" :size="24" weight="light" class="text-red-600" />
    </ClientOnly>
    <!--#endif-->
    <!--#if [LOWCODE]-->
    <PhCheckCircle v-if="data.success" :size="24" weight="light" class="text-lime-500" />
    <PhXCircle v-if="!data.success" :size="24" weight="light" class="text-red-600" />
    <!--#endif-->
    <span class="text-zinc-500">{{ data.message }}</span>
  </div>
</template>
<script setup lang="ts">
import { PhCheckCircle, PhXCircle } from '@phosphor-icons/vue'
import type { ShortErrorInfo } from '@shared/schema'
import { onMounted } from 'vue'
defineProps<{
  data: ShortErrorInfo
}>()
const emit = defineEmits(['close-info'])
onMounted(() => {
  setTimeout(() => {
    emit('close-info', true)
  }, 5000)
})
</script>
<style scoped>
.short-info {
  z-index: 99999999;
  left: 50%;
  transform: translateX(-50%);
}
</style>
