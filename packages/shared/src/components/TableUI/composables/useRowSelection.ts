import { ref, type Ref } from 'vue'
export function useRowSelection(totalRows: Ref<number>) {
  const selectedRows = ref<Map<number | string, any>>(new Map())
  const lastSelectedIndex = ref(-1)

  // 切换单行
  const toggleRow = (rowId: number, toggle: boolean, shiftKey: boolean = false) => {
    if (shiftKey && lastSelectedIndex.value !== -1) {
      // Shift 多选
      const start = Math.min(lastSelectedIndex.value, rowId)
      const end = Math.max(lastSelectedIndex.value, rowId)
      for (let i = start; i <= end; i++) {
        selectedRows.value.set(i, { isSelected: true })
      }
    } else {
      if (toggle) {
        //单行选中正反选
        if (selectedRows.value.has(rowId)) {
          const isSelected = selectedRows.value.get(rowId).isSelected
          selectedRows.value.set(rowId, { isSelected: !isSelected, changed: true })
        } else {
          selectedRows.value.set(rowId, { isSelected: true })
        }
      } else {
        //单行选中不反选
        selectedRows.value.set(rowId, { isSelected: true })
      }
    }
    lastSelectedIndex.value = rowId
  }
  const toggleGroupRows = (groupName: string, rowIds: number[]) => {
    let isSelected = false
    if (selectedRows.value.has(groupName)) {
      isSelected = selectedRows.value.get(groupName).isSelected
    }
    selectedRows.value.set(groupName, { isSelected: !isSelected, isGroup: true })
    for (let i = 0; i < rowIds.length; i++) {
      if (rowIds[i] === undefined) continue
      selectedRows.value.set(rowIds[i]!, { isSelected: !isSelected })
    }
  }

  // 全选
  const selectAll = () => {
    for (let i = 0; i < totalRows.value; i++) {
      selectedRows.value.set(i, { isSelected: true })
    }
  }

  // 反选
  const invertSelection = () => {
    const newSelection = new Map()
    for (let i = 0; i < totalRows.value; i++) {
      if (!selectedRows.value.has(i)) {
        newSelection.set(i, { isSelected: true, changed: true })
      }
    }
    selectedRows.value = newSelection
  }

  // 清空选中
  const clearSelection = () => {
    selectedRows.value.clear()
  }

  return {
    selectedRows,
    isSelected: (rowId: number) => {
      if (selectedRows.value.has(rowId)) {
        const row = selectedRows.value.get(rowId)
        return row.isSelected
      }
      return false
    },
    toggleRow,
    toggleGroupRows,
    selectAll,
    invertSelection,
    clearSelection,
  }
}
