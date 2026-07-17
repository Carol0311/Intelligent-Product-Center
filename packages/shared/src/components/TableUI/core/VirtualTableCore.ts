//表格虚拟滚动
export interface VirtualTableOptions {
  rowHeight: number
  totalRows: number
  overscanCount?: number // 预渲染行数
  mode: 'DOM' | 'CANVAS'
}

export class VirtualTableCore {
  private rowHeight: number
  private totalRows: number
  private overscanCount: number
  private mode: 'DOM' | 'CANVAS'
  private scrollTop = 0
  private containerHeight = 0

  constructor(options: VirtualTableOptions) {
    this.rowHeight = options.rowHeight
    this.totalRows = options.totalRows
    this.overscanCount = options.overscanCount || 5
    this.mode = options.mode
  }

  // 计算需要渲染的行范围
  calculateVisibleRange(scrollTop?: number, containerHeight?: number) {
    const top = scrollTop ?? this.scrollTop
    const height = containerHeight ?? this.containerHeight

    const startIndex = Math.floor(top / this.rowHeight)
    const endIndex = Math.min(startIndex + Math.ceil(height / this.rowHeight), this.totalRows)

    if (this.mode === 'CANVAS' && top === this.totalRows * this.rowHeight - height) {
      //滚动到最后，不需要预渲染行
      //如果可视区域高度不是行高度的整数倍，则需要避免最后一行绘制不完整
      const bottomScan = height % this.rowHeight === 0 ? 0 : 1
      return { start: startIndex + bottomScan, end: endIndex }
    }
    // 添加 overscan，预渲染一些行
    const start = Math.max(0, startIndex - this.overscanCount)
    const end = Math.min(this.totalRows, endIndex + this.overscanCount)

    return { start, end }
  }

  // 计算偏移量（用于 transform）
  getOffsetY(scrollTop: number) {
    let start = Math.floor(scrollTop / this.rowHeight)
    start = Math.max(0, start - this.overscanCount)
    return start * this.rowHeight
  }

  // 更新滚动位置
  updateScroll(scrollTop: number, containerHeight: number) {
    this.scrollTop = scrollTop
    this.containerHeight = containerHeight
    return this.calculateVisibleRange(scrollTop, containerHeight)
  }

  // 更新总行数（数据变化时）
  updateTotalRows(totalRows: number) {
    this.totalRows = totalRows
  }
}
