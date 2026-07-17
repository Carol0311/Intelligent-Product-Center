<template>
  <div class="p-switch flex flex-row my-3 items-center">
    <div class="mr-1 w-20">
      <span>{{ data.name }}</span>
      <PhQuestion v-show="tips" :size="14" class="mb-0.5" weight="light" />
    </div>
    <div class="flex-1 text-gray-200">
      <PhToggleLeft v-show="!open" :size="28" weight="fill" @click="changeEvt" />
      <PhToggleRight
        v-show="open"
        :size="28"
        weight="fill"
        class="text-orange-300"
        @click="changeEvt"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, inject, watch } from 'vue'
import { PhQuestion, PhToggleLeft, PhToggleRight } from '@phosphor-icons/vue'
const tips = ref(false)
defineProps<{
  data: {
    name: string
  }
}>()
const propsChange = inject<{ update: () => void }>('propsChange')
const model = defineModel<boolean>()
const open = ref(model.value)
//属性值更新时立即更新对应组件属性数据
const changeEvt = () => {
  open.value = !open.value
  model.value = open.value
  propsChange?.update()
}
watch(
  () => model.value,
  (newVal) => {
    open.value = Boolean(newVal)
  },
)
</script>
<style scoped></style>
