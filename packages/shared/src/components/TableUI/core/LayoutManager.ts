import type { ColumnSchema } from '@shared/schema'
export class LayoutManager {
  private columnWidths = <Record<string, number>>{}
  private containerWidth = 0
  private CheckboxColumnWidth: number = 40
  private avarageWidth: number = 60
  private tableHeight: number = 0

  constructor(
    private columns: ColumnSchema[],
    container: HTMLElement,
    headHeight: number
  ) {
    this.containerWidth = container.clientWidth
    this.tableHeight = container.clientHeight - headHeight
    this.avarageWidth = (this.containerWidth - this.CheckboxColumnWidth) / this.columns.length
    this.initColumnWidths()
    // #if [PRODUCT]
    this.tableHeight = this.getDefaultTableHeight(container, headHeight)
    //#endif
  }

  // #if [PRODUCT]
  //默认表格高度到达屏幕一屏底部
  private getDefaultTableHeight(container: HTMLElement, headHeight: number): number {
    const rect = container.getBoundingClientRect()
    const listContainer = container.closest('[list-container="true"]')
    const rightContainer = container.closest('.s-right')
    let newHeight = rect.height - headHeight
    if (rightContainer && listContainer) {
      newHeight = newHeight + rightContainer?.clientHeight - 16 - listContainer?.clientHeight
      return Math.max(newHeight, 200)
    } else {
      return newHeight
    }
  }
  // #endif

  // 初始化列宽策略
  private initColumnWidths() {
    this.columns.forEach((col) => {
      if (col.props.width) {
        // 固定宽度
        this.columnWidths[col.key] = this.parseSize(col.props.width, this.containerWidth)
      } else if (col.props.minWidth) {
        // 最小宽度，可拉伸
        const minWidth = this.parseSize(col.props.minWidth, this.containerWidth)
        this.columnWidths[col.key] = Math.max(minWidth, this.avarageWidth)
      } else {
        // 默认宽度
        this.columnWidths[col.key] = this.avarageWidth
      }
    })
  }

  // 响应容器宽度变化
  resize(containerWidth: number) {
    this.containerWidth = containerWidth - 42

    // 计算固定宽度的总和
    let fixedTotal = 0
    const flexColumns: ColumnSchema[] = []

    this.columns.forEach((col) => {
      if (col.props.width && !col.props.width.toString().includes('%')) {
        fixedTotal += this.columnWidths[col.key]!
      } else {
        flexColumns.push(col)
      }
    })

    // 将剩余宽度均分给自适应列
    const remainingWidth = this.containerWidth - fixedTotal
    const flexWidth = remainingWidth / flexColumns.length

    flexColumns.forEach((col) => {
      this.columnWidths[col.key] = Math.max(Number(col.props.minWidth) || 60, flexWidth)
    })
  }

  // 手动调整列宽
  resizeColumn(colKey: string, newWidth: number) {
    this.columnWidths[colKey] = newWidth

    // 更新列配置
    const col = this.columns.find((c) => c.key === colKey)
    if (col) {
      col.props.width = newWidth
    }

    // 触发重新布局（但不重新渲染所有数据）
    return this.columnWidths
  }

  parseSize(size: string | number, containerSize: number): number {
    if (typeof size === 'number') return size
    if (size.endsWith('px')) return parseFloat(size)
    if (size.endsWith('%')) {
      // 百分比需要容器宽度
      return containerSize * (parseFloat(size) / 100)
    }
    return 60
  }

  // 获取当前所有列宽
  getColumnWidths(): Record<string, number> {
    return this.columnWidths
  }
  //获取表格高度
  getTableHeight(): number {
    return this.tableHeight
  }
}
