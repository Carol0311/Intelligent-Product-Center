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
        :class="{ 'opacity-30': data.readonly }"
        @click="changeEvt"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, inject, watch } from 'vue'
import { PhQuestion, PhToggleLeft, PhToggleRight } from '@phosphor-icons/vue'
const tips = ref(false)
const props = defineProps<{
  data: {
    name: string
    readonly?: boolean
  }
}>()
const propsChange = inject<{ update: () => void }>('propsChange')
const model = defineModel<boolean | number>()
const open = ref(Boolean(model.value))
//属性值更新时立即更新对应组件属性数据
const changeEvt = () => {
  if (props.data.readonly) return
  open.value = !open.value
  model.value = Boolean(open.value)
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
