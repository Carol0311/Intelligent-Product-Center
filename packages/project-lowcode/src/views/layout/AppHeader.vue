<template>
  <div
    class="lowcode-header flex flex-row justify-between items-center px-3 py-2 bg-white border-b border-solid border-zinc-200"
  >
    <div class="flex flex-row items-center">
      <div class="text-sm text-orange-400">低代码平台</div>
      <a
        :href="product_home"
        target="_blank"
        class="bg-lime-600 text-white rounded ml-3 text-xs px-2 py-1"
        >商品中心</a
      >
    </div>
    <div class="inline-flex flex-row items-center">
      <div
        class="inline-block bg-orange-300 text-white px-3 leading-6 rounded mr-4"
        @click="savePageAct"
      >
        保存
      </div>
      <div class="bg-red-400 text-white px-3 leading-6 rounded mr-4" @click="deletePageAct">
        删除
      </div>
      <div class="bg-lime-600 text-white px-3 leading-6 rounded mr-4" @click="handlePreview">
        预览
      </div>
      <PhRobot
        :size="36"
        weight="duotone"
        class="text-orange-300"
        @click="() => (openChat = true)"
      />
      <ChatAI
        v-if="openChat"
        :class="{ show: openChat, hide: !openChat }"
        @close-chat="() => (openChat = false)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { PhRobot } from '@phosphor-icons/vue'
import { storeToRefs } from 'pinia'
import { useProjectStore, useEditorStore, useTableStore } from '@/stores'
import { savePage, deletePage, getPageList, eventBus, updateTableConfig } from 'public-shared'
import ChatAI from './ChatAI.vue'

const openChat = ref(false)

const editorStore = useEditorStore()
const projectStore = useProjectStore()

const tableStore = useTableStore()

const { currentPage } = storeToRefs(editorStore)
const { setCurrentPage, clearPages } = editorStore
const { setProject } = projectStore
const { changed, columns } = storeToRefs(tableStore)

const product_home = `${import.meta.env.VITE_PRODUCT_CENTER}`
const savePageAct = () => {
  //保存前审核是否有表格设置改动，如果有，先保存表格设置
  const hasTableChanged = []
  const components = currentPage.value?.components || {}
  for (const key in components) {
    if (changed.value[key]) {
      hasTableChanged.push(changed.value[key])
      break
    }
  }
  if (hasTableChanged.length > 0) {
    hasTableChanged.forEach(async (table) => {
      await updateTableConfig({
        instanceId: table.instanceId,
        tableId: table.tableId,
        pageId: table.pageId,
        columns: columns.value[table.tableId],
      })
    })
  }
  savePage(currentPage.value).then((res) => {
    if (res.success && currentPage.value) {
      setCurrentPage({ ...currentPage.value, isSaved: true })
    }
  })
}
const deletePageAct = async () => {
  if (!currentPage.value) return
  if (currentPage.value.isSystem) {
    eventBus.emit('show-modal', {
      type: 'confirm',
      message: '系统预置文件无法删除!',
      buttons: [{ type: 'confirm', name: '确定' }],
    })
    return
  }
  await deletePage({ id: currentPage.value?.id }).then((res) => {
    console.log(res)
  })
  getPageList().then((res) => {
    if (res.success && res.data) {
      setProject(res.data.pageList)
      if (res.data.pageList.length > 0) {
        setCurrentPage(res.data.pageList[0])
      } else {
        clearPages()
      }
    }
  })
}
//预览当前页面
const handlePreview = () => {
  window.open(
    `${import.meta.env.VITE_PRODUCT_CENTER}/dynamic?preview=${currentPage.value?.pageId}&name=${currentPage.value?.name}`,
    '_blank',
  )
}
</script>
<style scoped>
.robot-ai {
  animation: robot-rotate 5s infinite linear;
}
@keyframes robot-rotate {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
