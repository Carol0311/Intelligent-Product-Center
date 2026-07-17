import { TableDataManager } from './TableDataManager'
import { GroupTableManager } from './GroupTableManager'
export interface WorkerMessage {
  type:
    | 'INIT_FIRST'
    | 'INIT_REST'
    | 'SCROLL'
    | 'UPDATE_CELL'
    | 'SORT'
    | 'FILTER'
    | 'INIT_GROUP_FIRST'
    | 'INIT_GROUP_TOTAL'
    | 'SCROLL_GROUP'
    | 'UPDATE_CELL_IN_GROUP'
    | 'TOGGLE_GROUP'
    | 'GET_ROW_IN_GROUP'
  payload?: any
  requestId?: string
}

const dataManager = new TableDataManager()
const groupManager = new GroupTableManager()

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { type, payload, requestId } = e.data

  switch (type) {
    //非分组表格加载首屏数据
    case 'INIT_FIRST':
      await dataManager.init(payload.config)
      // 初始返回第一屏数据
      const firstScreen = await dataManager.getVisibleData(0, payload.overscanCount || 10)
      self.postMessage({
        type: 'INIT_DATA_UPDATE',
        payload: { data: firstScreen, start: 0, end: 10, totalCount: payload.config.totalCounts },
        requestId,
      })
      break
    //非分组表格批量加载剩余数据
    case 'INIT_REST':
      //批量加载剩余数据
      const length = await dataManager.loadRestData(payload.config)
      //数据加载完成，通知主线程
      self.postMessage({
        type: 'DATA_LOAD_COMPLETE',
        payload: { isLoadCompleted: true, totalCount: length },
        requestId,
      })
      break
    //分组表格加载首屏数据
    case 'INIT_GROUP_FIRST':
      await groupManager.init(payload.config)
      let totalGroupNames = groupManager.getTotalGroupNames()
      const firstData = groupManager.getVisibleGroupData(0, payload.overscanCount || 10, new Set(totalGroupNames))
      self.postMessage({
        type: 'GROUP_DATA_UPDATE',
        payload: {
          data: firstData,
          start: 0,
          end: payload.overscanCount || 10,
          initCounts: firstData.length,
          totalCount: payload.config.totalCounts,
          totalGroupNames,
        },
        requestId,
      })
      break
    //分组表格批量加载全部数据
    case 'INIT_GROUP_TOTAL':
      //批量加载全部数据
      await groupManager.loadBatchData(payload.config)
      const reset_result = groupManager.resetGroupCache()
      //数据加载完成，通知主线程
      self.postMessage({
        type: 'GROUP_DATA_LOAD_COMPLETE',
        payload: { totalCount: reset_result.totalGroupCount, totalGroupNames: reset_result.totalGroupNames },
        requestId,
      })
      break

    case 'SCROLL':
      const visibleData = await dataManager.getVisibleData(payload.start, payload.end)
      self.postMessage({
        type: 'VISIBLE_UPDATE',
        payload: { data: visibleData, ...payload },
        requestId,
      })
      break
    case 'SCROLL_GROUP':
      const visibleGroupData = groupManager.getVisibleGroupData(payload.start, payload.end, new Set(payload.expandGroup))
      self.postMessage({
        type: 'GROUP_VISIBLE_UPDATE',
        payload: { data: visibleGroupData, ...payload },
        requestId,
      })
      break

    case 'UPDATE_CELL':
      const updatedRow = dataManager.updateCell(payload.rowId, payload.colKey, payload.value)
      // 只返回更新的行
      if (updatedRow) {
        self.postMessage({
          type: 'ROW_UPDATE',
          payload: { rowId: payload.rowId, updatedRow },
          requestId,
        })
      }
      break
    case 'UPDATE_CELL_IN_GROUP':
      const updatedGroupRow = groupManager.updateCellInGroup(payload.rowId, payload.colKey, payload.value)
      // 只返回更新的行
      if (updatedGroupRow) {
        self.postMessage({
          type: 'GROUP_ROW_UPDATE',
          payload: { rowId: payload.rowId, updatedRow: updatedGroupRow },
          requestId,
        })
      }
      break
    case 'TOGGLE_GROUP':
      groupManager.toggleGroupExpand(new Set(payload.expandGroup))
      const groupData = groupManager.getVisibleGroupData(payload.start, payload.end, new Set(payload.expandGroup))
      self.postMessage({
        type: 'GROUP_TOGGLE_UPDATE',
        payload: { data: groupData, ...payload },
        requestId,
      })
      break
    case 'GET_ROW_IN_GROUP':
      const groupRow = groupManager.getItemByIndex(payload.rowIndex)
      self.postMessage({
        type: 'GET_FROM_GROUP',
        payload: { data: groupRow },
        requestId,
      })
  }
}
