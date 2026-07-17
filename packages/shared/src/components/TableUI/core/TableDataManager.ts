import { loadTableData } from '@shared/http/tableApi'
export class TableDataManager {
  private rawData: any[] = []
  private filters: Map<string, any> = new Map()
  private sortConfig: { column: string; order: 'asc' | 'desc' } | null = null
  private INIT_NUM: number = 1000
  private BATCH_SIZE: number = 3000
  private total: number = 0
  private delayTimer: number = 0

  async init(config: Record<string, any>) {
    const result = await this.loadInitData(config)
    if (result) {
      this.total = result.total
      this.rawData = result.rows
    }
    return this.total
  }

  //加载表格首屏数据
  async loadInitData(config: Record<string, any>) {
    const result = await loadTableData({ instanceId: config.instanceId, start: 0, limit: this.INIT_NUM })
    if (result.success && result.data) {
      return result.data
    }
    return null
  }
  //批量加载分批数据
  async loadRestData(config: Record<string, any>) {
    let start = 0
    let hasMore = true
    //let restData = []
    start = this.INIT_NUM + this.BATCH_SIZE * start
    while (hasMore) {
      const result = await loadTableData({ instanceId: config.instanceId, start, limit: this.BATCH_SIZE })
      if (result.success) {
        const batchData = result.data
        if (batchData) {
          this.rawData = [...this.rawData, ...batchData.rows]
          //restData.push(...batchData.rows)
          if (batchData.rows.length === 0) {
            hasMore = false
          } else {
            start += batchData.rows.length
          }
        }
      } else {
        //该批次请求失败，中断处理
        hasMore = false
      }
      // 延迟 10 毫秒 避免主线程过度占用
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
    return this.rawData.length
  }

  async getVisibleData(start: number, end: number, retries: number = 1): Promise<any[]> {
    clearTimeout(this.delayTimer)
    // 先在 Worker 中过滤、排序
    const processed = [...this.rawData]

    if (this.sortConfig) {
      processed.sort((a, b) => {
        // 升序
        return a - b
      })
    }

    // 只返回需要的数据
    const result = processed.slice(start, end)

    if (result.length > 0) {
      return result
    }
    if (result.length === 0 && end <= this.total && retries < 50) {
      console.log(`${start}--${end}行轮询加载中...,第${retries}次轮询`)
      await new Promise((resolve) => {
        clearTimeout(this.delayTimer)
        this.delayTimer = setTimeout(resolve, 100)
      })
      return this.getVisibleData(start, end, retries + 1)
    }
    return result
  }

  updateRawData(data: any[]) {
    this.rawData = [...this.rawData, ...data]
  }

  updateCell(rowId: number, colKey: string, value: any) {
    const index = this.rawData.findIndex((d) => d.rowId === rowId)
    if (index !== -1) {
      this.rawData[index][colKey] = value
      return this.rawData[index]
    }
    return null
  }
}
