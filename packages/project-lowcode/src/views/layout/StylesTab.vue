<template>
  <div class="styles-tab">
    <PLayout v-model="stylesData" />
    <PFont v-model="stylesData" />
    <PBackGround v-model="stylesData" />
    <PPos v-model="stylesData" />
    <PBoder v-model="stylesData" />
  </div>
</template>
<script lang="ts" setup>
import { ref, provide, watch } from 'vue'
import { PLayout, PFont, PBackGround, PPos, PBoder } from '@/components/PropUI'
import { useEditorStore } from '@/stores/editorStore'
import { storeToRefs } from 'pinia'
import { deepToRaw } from 'public-shared'
const editorStore = useEditorStore()
const { selectedComponent } = storeToRefs(editorStore)
const { updateComponent } = editorStore
const stylesData = ref<Record<string, any>>({})
const cid = ref<string>('')
const update = () => {
  updateComponent(cid.value, { inlineStyle: deepToRaw(stylesData.value) })
}
provide('propsChange', { update })
watch(
  () => selectedComponent.value,
  (com) => {
    if (com) {
      cid.value = com.props.cid!
      if (com.props.inlineStyle) {
        stylesData.value = com.props.inlineStyle
      }
    }
  },
  { immediate: true },
)
</script>
<style scoped></style>
