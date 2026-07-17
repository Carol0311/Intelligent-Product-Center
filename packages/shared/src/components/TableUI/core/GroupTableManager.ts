import { loadTableData, loadTargetGroup } from '@shared/http/tableApi'

export class GroupTableManager {
  //原始数据
  private rawData: any[] = []
  //首屏第一组数据100条
  private firstGroupData: any[] | null = null
  //第一组数据总条数
  private firstGroupTotal: number = 0
  //分组字段
  private groupFields: Record<string, any>[] = []
  //分组索引  分组字段---下标---数据
  private groupCache = new Map<string, { ids: string[]; data: any[] }>()
  //扁平索引----原始数据索引映射
  private flatIndexCache: any[] = []
  private INIT_NUM: number = 1000
  private BATCH_SIZE: number = 3000
  private isLoadCompleted: boolean = false

  async init(config: Record<string, any>) {
    const result = await this.loadInitData(config)
    if (result) {
      this.firstGroupData = result.rows
      this.firstGroupTotal = result.total
      this.rawData = []
    }
    this.groupFields = config.groupBy.fields
    this.buildGroupCache(this.firstGroupData)
  }

  //加载表格首屏的分组数据1000条数据
  async loadInitData(config: Record<string, any>) {
    const result = await loadTargetGroup({ instanceId: config.instanceId, limit: this.INIT_NUM, groupIndex: 0, groupBy: config.groupBy })
    if (result.success && result.data) {
      return result.data
    }
    return null
  }
  //批量加载总数据
  async loadBatchData(config: Record<string, any>) {
    let start = 0
    let hasMore = true
    //let restData = []
    start = this.BATCH_SIZE * start
    while (hasMore) {
      const result = await loadTableData({ instanceId: config.instanceId, start, limit: this.BATCH_SIZE })
      if (result.success) {
        const batchData = result.data
        if (batchData) {
          this.rawData.push(...batchData.rows)
          if (batchData.rows.length === 0) {
            hasMore = false
          } else {
            start += batchData.rows.length
          }
        }
      } else {
        //该批次请求失败，继续重复此次请求
      }
      await new Promise((resolve) => setTimeout(resolve, 10)) // 延迟 10 毫秒 避免过度占用
    }
    return this.rawData.length
  }

  /**
   * 不传入时默认使用rawData数据进行分组和扁平化索引处理
   */
  buildGroupCache(targetData?: any[] | null) {
    let data: any[] = []
    if (targetData) {
      data = targetData
    } else {
      data = this.rawData
    }
    //分组字段---索引映射
    const tempGroup = new Map<string, string[]>()

    data.forEach((item) => {
      //默认分组信息头风格:  单据金额:$234 到帐日期:2026-06-26
      const groupKey = this.groupFields.map((gitem) => `${gitem.name}:${item[gitem.key]}`).join(' ')
      if (!tempGroup.has(groupKey)) {
        tempGroup.set(groupKey, [])
      }
      item.groupKey = groupKey
      tempGroup.get(groupKey)?.push(item.rowId)
    })

    //存储分组数据
    for (const [groupKey, idsArr] of tempGroup) {
      this.groupCache.set(groupKey, {
        ids: idsArr,
        data: idsArr.map((rowId: any) => {
          if (targetData) {
            const item = data.find((row) => row.rowId === rowId)
            if (item) {
              return item
            }
          }
          return data[rowId]
        }),
      })
    }

    //构建扁平索引
    let flatIndex = 0
    for (const [_, group] of this.groupCache) {
      //分组表头
      this.flatIndexCache[flatIndex++] = -1

      for (let i = 0; i < group.ids.length; i++) {
        this.flatIndexCache[flatIndex++] = group.ids[i]
      }
    }
  }

  rebuildFlatCache(expandGroup: Set<string>) {
    let flatIndex = 0
    for (const [groupName, group] of this.groupCache) {
      //分组表头
      if (expandGroup.has(groupName)) {
        this.flatIndexCache[flatIndex++] = -1

        for (let i = 0; i < group.ids.length; i++) {
          this.flatIndexCache[flatIndex++] = group.ids[i]
        }
      }
    }
  }

  //根据索引获取目标数据
  getItemByIndex(rowIndex: number) {
    const flatId = this.flatIndexCache[rowIndex]
    //获取对应的分组表头信息
    if (flatId === -1) {
      return this.getGroupHeaderByIndex(rowIndex)
    }
    return this.rawData.find((row) => row.rowId === flatId)
  }

  //根据索引获取表头信息
  getGroupHeaderByIndex(flatIndex: number) {
    let currentIndex = 0
    for (const [groupName, group] of this.groupCache) {
      if (flatIndex === currentIndex) {
        return { isGroup: true, name: groupName, count: group.ids.length, ids: group.ids }
      }
      currentIndex += group.ids.length + 1
      if (flatIndex < currentIndex) break
    }
    return null
  }
  getTotalRows() {
    return this.flatIndexCache.length
  }

  getTotalGroupNames() {
    return [...this.groupCache.keys()]
  }

  getVisibleGroupData(start: number, end: number, expandGroup: Set<string>, retries: number = 1) {
    const result: any[] = []
    let currentIndex = 0
    for (const [groupName, group] of this.groupCache) {
      const isExpanded = expandGroup.has(groupName)
      const groupCount = 1 + (isExpanded ? group.ids.length : 0)

      if (currentIndex + groupCount > start && currentIndex < end) {
        if (currentIndex >= start) {
          result.push({ isGroup: true, name: groupName, count: group.ids.length })
        }
        //如果此组数据是展开的
        if (isExpanded) {
          const _start = Math.max(0, start - currentIndex - 1)
          const _end = Math.min(end - currentIndex - 1, group.ids.length)
          for (let i = _start; i < _end; i++) {
            const item = group.data.find((row) => row.rowId === group.ids[i])
            if (item) {
              result.push(item)
            }
          }
        }
      }
      currentIndex += groupCount
    }
    return result
  }
  /**数据加载完成后重新处理分组和索引*/
  resetGroupCache() {
    //清空分组索引和映射
    this.groupCache = new Map<string, { ids: string[]; data: any[] }>()
    this.flatIndexCache = [] as any[]
    this.buildGroupCache()
    this.isLoadCompleted = true
    console.log('加载结束', this.flatIndexCache)
    return { totalGroupCount: this.getTotalRows(), totalGroupNames: this.getTotalGroupNames() }
  }
  /**
   * 编辑单元格触发
   * 数据加载完成前使用第一组分组数据
   * 数据加载完成后使用全部处理后的分组数据
   */
  updateCellInGroup(rowId: number, colKey: string, value: any) {
    const data = this.isLoadCompleted ? this.rawData : this.firstGroupData
    if (!data) return null
    const findex = this.flatIndexCache.find((v) => v === rowId)
    if (findex) {
      //更新原始数据
      const target = data[findex]
      data[findex][colKey] = value
      //更新groupCache中的数据
      this.groupCache.get(target.groupKey)?.data.forEach((item) => {
        if (item.rowId === rowId) {
          item[colKey] = value
        }
      })
      return data[findex]
    }
    return null
  }
  toggleGroupExpand(expandGroup: Set<string>) {
    this.rebuildFlatCache(expandGroup)
  }
}
