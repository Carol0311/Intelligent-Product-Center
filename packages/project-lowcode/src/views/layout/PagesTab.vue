<template>
  <div
    class="pages-tab relative w-full flex flex-row justify-between items-center overflow-hidden h-8 border-b border-zinc-200 border-solid text-gray-500"
  >
    <div ref="pageWrapper" class="h-full flex-1" :style="{ 'margin-left': moveDistance + 'px' }">
      <div
        v-for="page in pageList"
        :id="page.id"
        :key="page.id"
        :pageId="page.pageId"
        :cpageId="currentPage.pageId"
        class="page-item inline-flex flex-row justify-between items-center h-full px-2 border-r border-zinc-200 border-solid"
        :class="{
          'bg-orange-300 text-white': currentPage.pageId === page.pageId,
          'bg-white': currentPage.pageId !== page.pageId,
        }"
        @click.prevent="pageClick(page.id)"
      >
        <span class="min-w-16 max-w-48 text-ellipsis whitespace-nowrap overflow-hidden">{{
          page.name
        }}</span>
        <PhXCircle weight="light" :size="14" @click.stop="closePageAct(page.id)" />
      </div>
    </div>
    <div class="inline-flex leading-8 text-center bg-white text-orange-400">
      <div class="w-8"><PhPlus :size="16" weight="light" @click="createPageAct" /></div>
      <div class="w-8" @click="handleOpenList">
        <PhDotsThreeCircle :size="16" weight="duotone" />
      </div>
    </div>
    <div
      v-show="showList"
      class="fixed page-list-panel bg-white overflow-auto h-52 p-2.5 shadow w-44"
      :style="listPanelStyle"
    >
      <div
        v-for="page in pageList"
        :key="page.id"
        class="item mb-1 hover:text-orange-300"
        @click="handleListItemClick(page.id)"
      >
        {{ page.name }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { PhXCircle, PhPlus, PhDotsThreeCircle } from '@phosphor-icons/vue'
import { createPage, getPageList, savePage, generateUniqueId, eventBus } from 'public-shared'
import type { PageSchema } from 'public-shared'
import { useProjectStore, useEditorStore } from '@/stores'

const emit = defineEmits(['showEdit'])
//控制页面列表是否显示
const showList = ref(false)
const listPanelStyle = ref<Record<string, any> | null>(null)
const moveDistance = ref(0)

const pageWrapper = ref<HTMLElement | null>(null)

const editorStore = useEditorStore()
const projectStore = useProjectStore()

const { pages } = storeToRefs(projectStore)
const { currentPage } = storeToRefs(editorStore)

const { setCurrentPage, setCurrentPageId } = editorStore
const { setProject } = projectStore

const pageList = ref<Record<string, PageSchema>>({})

watch(
  () => pages.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      pageList.value = newVal
    }
  },
)

//点击+请求创建新页面
const createPageAct = async () => {
  emit('showEdit', false)
  const tempPageId = generateUniqueId('Page')
  await createPage({
    id: tempPageId, //初次创建服务端会重置这个id,后续不可修改
    pageId: tempPageId, //后续可修改
    name: '新页面',
    rootComponentIds: [],
    components: {},
    isSystem: false,
  }).then((res) => {
    console.log(res)
  })
  getPageList().then((res) => {
    if (res.success && res.data) {
      setProject(res.data.pageList)
      pageList.value = pages.value
      if (res.data.pageList.length > 0) {
        setCurrentPage(res.data.pageList[0])
      }
    }
  })
}
const closeAct = (id: string) => {
  const { [id]: _, ...filterPageList } = pageList.value
  pageList.value = filterPageList
  const first = Object.keys(pageList.value)[0]
  if (first) {
    setCurrentPage(pageList.value[first])
  } else {
    currentPage.value = undefined
  }
}
//关闭页面标签
const closePageAct = async (id: string) => {
  emit('showEdit', false)
  //如果关闭时当前页面有未保存的修改，询问是否保存
  if (currentPage.value?.isSaved === false) {
    eventBus.emit('show-modal', {
      type: 'confirm',
      message: '文件还未保存，需要保存后关闭吗？',
      buttons: [
        { type: 'cancel', name: '不保存', action: 'close-tab', payload: { id } },
        {
          type: 'save',
          name: '保存',
          action: 'save-tab',
          payload: { id, after: 'close-tab' },
        },
      ],
    })
  } else {
    //否则直接关闭
    closeAct(id)
  }
}
const pageClick = async (id: string) => {
  emit('showEdit', false)
  //如果切换时当前页面有未保存的修改，询问是否保存
  if (currentPage.value?.isSaved === false) {
    eventBus.emit('show-modal', {
      type: 'confirm',
      message: '当前文件还未保存，需要保存后切换吗？',
      buttons: [
        { type: 'cancel', name: '不保存', action: 'switch-tab', payload: { id } },
        {
          type: 'save',
          name: '保存',
          action: 'save-tab',
          payload: { id, after: 'switch-tab' },
        },
      ],
    })
  } else {
    //否则直接切换
    const page = pageList.value[id]
    setCurrentPageId(page.pageId)
  }
}
//打开页面列表
const handleOpenList = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const rect = target.getBoundingClientRect()
  listPanelStyle.value = {
    top: `${rect.top + rect.height + 8}px`,
  }
  showList.value = !showList.value
}
//打开列表中的页面
const handleListItemClick = (id: string) => {
  if (!pageWrapper.value) return
  pageClick(id)
  let preWidth = 0
  let addWidth = 0
  const rect = pageWrapper.value.getBoundingClientRect()
  const wrapperWidth = rect.width + Math.min(0, rect.left)
  const items = [...document.querySelectorAll('.pages-tab .page-item')]
  for (let i = 0; i < items.length; i++) {
    const item = items[i] as HTMLElement
    if (preWidth + item.clientWidth < wrapperWidth) {
      preWidth += item.clientWidth
    } else {
      addWidth += item.clientWidth
    }
    if (item.id === id) {
      break
    }
  }
  if (preWidth - wrapperWidth < 0 && addWidth === 0) {
    moveDistance.value = 0
  } else {
    moveDistance.value = 0 - (Math.max(0, preWidth - wrapperWidth) + addWidth)
  }
  showList.value = false
}
//保存按钮回调
eventBus.on('save-tab', async (params: Record<string, any>) => {
  if (currentPage.value?.isSaved === false) {
    await savePage(currentPage.value).then((res) => {
      if (res.success && currentPage.value) {
        setCurrentPage({ ...currentPage.value, isSaved: true })
      }
    })
    //保存后关闭当前页面
    if (params.after === 'close-tab') {
      closeAct(params.id)
    }
    //保存后切换到指定点击页面
    if (params.after === 'switch-tab') {
      const page = pageList.value[params.id]
      setCurrentPage(page)
    }
  }
})
//不保存按钮回调---关闭tab
eventBus.on('close-tab', (params: Record<string, any>) => {
  if (currentPage.value) {
    setCurrentPage({ ...currentPage.value, isSaved: undefined })
  }
  closeAct(params.id)
})
//不保存按钮回调---切换tab
eventBus.on('switch-tab', (params: Record<string, any>) => {
  if (currentPage.value) {
    setCurrentPage({ ...currentPage.value, isSaved: undefined })
  }
  const page = pageList.value[params.id]
  setCurrentPage(page)
})
</script>
<style scoped>
.page-list-panel {
  right: 320px;
  z-index: 10;
}
</style>
