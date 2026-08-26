import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ColumnSchema } from 'public-shared'
export const useTableStore = defineStore('table', () => {
  /***----------------------------model状态-----------------------------**/

  //columns数据
  const columns = ref<Record<string, any>>({})
  const configs = ref<Record<string, any>>({})
  const changed = ref<Record<string, any>>({})
  const dataCache = ref<Record<string, any>>({})

  //column数据
  const setColumn = (
    tableId: string,
    column: ColumnSchema[] | [],
    edit?: Record<string, any> | undefined,
  ) => {
    columns.value = { ...columns.value, [tableId]: column }
    changed.value = { ...changed.value, [tableId]: edit }
  }
  //config数据
  const setConfig = (
    tableId: string,
    config: Record<string, any>,
    edit?: Record<string, any> | undefined,
  ) => {
    configs.value = { ...configs.value, [tableId]: config }
    changed.value = { ...changed.value, [tableId]: edit }
  }

  //data是fflate压缩后的数据
  const setDataCache = (key: string, data: any) => {
    dataCache.value = { ...dataCache.value, [key]: data }
  }

  //获取当前页面model数据
  const getCurrentColumn = (tableId: string) => {
    return columns.value[tableId] || []
  }
  //获取表格配置
  const getTableConfig = (tableId: string) => {
    return configs.value[tableId] || {}
  }

  return {
    columns,
    configs,
    changed,
    dataCache,
    setColumn,
    getCurrentColumn,
    setConfig,
    getTableConfig,
    setDataCache,
  }
})
