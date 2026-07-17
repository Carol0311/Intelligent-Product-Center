import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { ProjectSchema, PageSchema } from 'public-shared'
export const useProjectStore = defineStore('project', () => {
  //状态

  //默认project
  const project = reactive<Omit<ProjectSchema, 'pages'>>({
    id: 'product',
    name: '智能商品档案',
    homePageId: 'appPage',
  })

  //所有页面
  const pages = ref<Record<string, PageSchema>>({})

  const setProject = (pageList: PageSchema[]) => {
    const newPages = {} as Record<string, PageSchema>
    pageList.forEach((page) => {
      newPages[page.id] = page
    })
    pages.value = newPages
  }

  return {
    project,
    pages,
    setProject,
  }
})
