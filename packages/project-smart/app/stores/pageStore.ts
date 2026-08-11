import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import type { PageSchema, ComponentSchema } from 'public-shared'

import { useProjectStore } from './projectStore'
// 初始化服务---模块化的单例模式
export const usePageStore = defineStore('page', () => {
  const projectStore = useProjectStore()
  const { pages } = storeToRefs(projectStore)
  // ==================== 状态 ====================

  //当前页面
  const currentPage = ref<PageSchema>()
  //当前页面id
  const currentPageId = ref<string>('')
  //当前选中的组件
  const selectedComponent = ref<ComponentSchema | null>(null)

  // ==================== 命令操作方法 ====================

  //更新组件属性props
  const updateComponent = async (componentId: string, updates: Record<string, any>, immediate: boolean = true) => {
    // 直接更新当前页面的组件属性
    const currentComponent = currentPage.value?.components[componentId]
    if (currentComponent) {
      Object.assign(currentComponent.props, updates)
    }
  }

  // ==================== 页面设置 ====================

  const setCurrentPage = (page: PageSchema) => {
    currentPage.value = page
    currentPageId.value = page.pageId
    pages.value[currentPageId.value] = page
  }
  const setCurrentPageId = (pageId: string) => {
    currentPageId.value = pageId
  }

  const setSelectedComponent = (componentId: string | null) => {
    if (componentId && currentPage.value) {
      selectedComponent.value = currentPage.value.components[componentId] || null
    } else {
      selectedComponent.value = null
    }
  }

  // ==================== 查询方法 ====================

  const findComponentById = (componentId: string) => {
    return currentPage.value?.components[componentId] || null
  }

  const findChildren = (componentId: string) => {
    const component = findComponentById(componentId)
    if (!component || !currentPage.value) return []

    return component.children.map((id) => currentPage.value!.components[id]).filter((c) => c !== undefined)
  }

  // ==================== 保存和同步 ====================

  const save = async (): Promise<boolean> => {
    if (!currentPage.value) return false

    try {
      //保存数据并向后端发请求

      console.log('保存成功')
      return true
    } catch (error) {
      console.error('保存失败:', error)
      return false
    }
  }

  return {
    // 状态
    currentPage,
    currentPageId,
    selectedComponent,

    updateComponent,
    // 设置
    setCurrentPage,
    setCurrentPageId,
    setSelectedComponent,

    // 查询
    findComponentById,
    findChildren,

    // 保存
    save,
  }
})
