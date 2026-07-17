import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useModelStore = defineStore('model', () => {
  /***----------------------------model状态-----------------------------**/

  //所有models数据
  const models = ref<Record<string, any>>({})

  //设置models数据
  const setCurrentModel = (pageId: string, modelData: Record<string, any>) => {
    models.value[pageId] = { ...models.value[pageId], ...modelData }
  }

  //获取当前页面model数据
  const getCurrentModel = (pageId: string | undefined) => {
    return models.value[pageId as string] || {}
  }

  return { models, setCurrentModel, getCurrentModel }
})
