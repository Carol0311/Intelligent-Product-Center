<template>
  <div :list-container="true">
    <div class="text-zinc-600 leading-9 text-sm">商品列表页</div>
    <component :is="get(com!.type)" v-for="com in rootComponents || []" :key="com!.id" :data="com" :data-id="com!.id" />
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { componentRegistry, getPageDetail } from 'public-shared'

//获取当前路由名称
const route = useRoute()

const { get } = componentRegistry

const pageStore = usePageStore()
const { currentPage, currentPageId } = storeToRefs(pageStore)
const { setCurrentPage } = pageStore

//获取页面组件节点
const rootComponents = computed(() => {
  if (currentPageId.value !== route.name) return []
  const components = currentPage.value?.components || {}
  const rootIds = currentPage.value?.rootComponentIds || []
  return rootIds.map((id: string) => components[id])
})

onMounted(() => {
  getPageDetail({ pageId: route.name }).then((res) => {
    if (res.success) {
      //设置当前页面组件映射数据
      setCurrentPage(res.data!)
    }
  })
})
</script>
