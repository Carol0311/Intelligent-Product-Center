<template>
  <div id="dynamic_form" :list-container="true">
    <div class="text-zinc-600 leading-9 text-sm">{{ pageName }}</div>
    <component :is="get(com!.type)" v-model="currentModel[com!.id]" v-for="com in rootComponents || []" :key="com!.id" :data="com" :data-id="com!.id" />
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { componentRegistry, getPageDetail, loadPageData } from 'public-shared'

//获取当前路由名称
const route = useRoute()

console.log('this is home')

const config = useRuntimeConfig()

const rpageId = 'home'

const { get } = componentRegistry

const pageStore = usePageStore()
const { currentPage, currentPageId } = storeToRefs(pageStore)
const { setCurrentPage } = pageStore

const modelStore = useModelStore()
const { setCurrentModel, getCurrentModel } = modelStore

const pageName = computed(() => {
  if (currentPageId.value) {
    return currentPage.value?.name
  }
  return (route.query.name as string) || (route.name as string)
})

//获取页面组件节点
const rootComponents = computed(() => {
  if (currentPageId.value !== rpageId) return []
  const components = currentPage.value?.components || {}
  const rootIds = currentPage.value?.rootComponentIds || []
  return rootIds.map((id: string) => components[id])
})
const currentModel = computed(() => {
  return getCurrentModel(currentPage.value?.pageId) || {}
})

const { data: pageData } = await useAsyncData(
  'page-data-home',
  async () => {
    console.log('当前请求在', window === undefined ? '服务端SSR' : '客户端')
    //获取页面组件数据
    const pageComponents = await getPageDetail({ pageId: rpageId, baseURL: config.public.productApiKey })
    if (pageComponents.success && pageComponents.data) {
      //设置当前页面组件映射数据
      setCurrentPage(pageComponents.data!)
    }

    //获取页面字段数据
    const pageData = await loadPageData({ pageId: rpageId, id: currentPage.value?.id, baseURL: config.public.productApiKey })

    //设置当前页面model数据
    if (pageData.success && pageData.data) {
      setCurrentModel(pageData.data.pageId, pageData.data.datas)
    }

    return { page: pageComponents, data: pageData }
  },
  {
    server: true,
    immediate: true,
    lazy: false,
  }
)

/**onMounted(() => {
  getPageDetail({ pageId: rpageId }).then((res) => {
    if (res.success) {
      //设置当前页面组件映射数据
      setCurrentPage(res.data!)
    }
  })
  loadPageData({ pageId: rpageId, id: currentPage.value?.id }).then((res) => {
    //设置当前页面model数据
    if (res.success && res.data) {
      setCurrentModel(res.data.pageId, res.data.datas)
    }
  })
})*/
</script>
