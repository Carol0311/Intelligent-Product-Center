<template>
  <div class="h-full bg-white w-80 p-3 text-gray-500">
    <div class="p-bread h-8"></div>
    <div class="flex flex-row text-center ui-tab h-10 mb-2.5 border-b border-solid border-zinc-300">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="flex-1"
        :class="{ active: activeTab === tab.id }"
        @click.stop="() => (activeTab = tab.id)"
      >
        {{ tab.name }}
      </div>
    </div>
    <div class="ui-tab-body">
      <PropsTab v-show="activeTab === 'props'" />
      <StylesTab v-show="activeTab === 'styles'" />
      <EventsTab v-show="activeTab === 'events'" />
      <AdvanceTab v-show="activeTab === 'advance'" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { AdvanceTab, EventsTab, PropsTab, StylesTab } from '@/views/layout'
import { ref } from 'vue'
const tabs = ref([
  { id: 'props', name: '属性' },
  { id: 'styles', name: '样式' },
  { id: 'events', name: '事件' },
  { id: 'advance', name: '高级' },
])
const activeTab = ref('props')
</script>
<style scoped>
.ui-tab-body {
  height: calc(100% - 4.5rem);
  overflow: auto;
}
.ui-tab > div {
  padding: 0.75rem 0;
  position: relative;
}
.ui-tab .active {
  color: rgb(253 186 116 / var(--tw-text-opacity, 1));
}
.ui-tab .active::after {
  content: '';
  display: inline-block;
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  height: 1px;
  background-color: rgb(253 186 116 / var(--tw-text-opacity, 1));
}
</style>
