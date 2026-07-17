<template>
  <div class="p-text my-3" :class="{ 'flex flex-row items-center': direction === 'h' }">
    <div
      class="mr-1"
      :class="{
        'w-20': direction === 'h',
        'w-full h-7 leading-7 bg-zinc-200 text-center rounded': direction === 'v',
      }"
    >
      <span>{{ data.name }}</span>
      <PhQuestion v-show="tips" :size="14" class="mb-0.5" />
    </div>
    <span v-if="data.readonly">{{ inputVal }}</span>
    <div
      v-else
      class="flex-1 border border-solid border-zinc-300 rounded h-7 px-2"
      :class="{ 'w-full my-2': direction === 'v' }"
    >
      <input type="text" class="w-full h-full" :value="inputVal" @change="changeEvt" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, inject } from 'vue'
import { PhQuestion } from '@phosphor-icons/vue'
const tips = ref(false)
const direction = ref('h')
const propsChange = inject<{ update: (isPage?: boolean) => void }>('propsChange')
const props = defineProps<{
  data: {
    name: string
    readonly?: boolean
    isPage?: boolean
  }
}>()
const model = defineModel<string>()
const inputVal = ref(model.value)
const changeEvt = (e: Event) => {
  const target = e.target as HTMLInputElement
  model.value = target.value.trim()
  propsChange?.update(props.data.isPage)
}
watch(
  () => model.value,
  (newVal) => {
    inputVal.value = newVal
  },
)
</script>
<style scoped></style>
