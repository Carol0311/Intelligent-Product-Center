import type { ColumnSchema } from '@shared/schema'
export class CanvasTableRender {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private columns: ColumnSchema[]
  private rowHeight: number
  private headHeight: number
  private data: any[]
  private selectedRows: Map<number, any> = new Map()
  private _distY: number = 0

  // 列宽缓存
  private columnWidths: Record<string, number> = {}
  private columnXCache: number[] = []

  //清晰度设置
  private devicePixelRatio: number = window.devicePixelRatio || 1
  private fontFamily: string = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  private fontSize: number = 12
  private totalCount: number = 0
  private _start: number = 0
  private CheckboxColumnWidth: number = 40

  constructor(container: HTMLElement, options: any) {
    this.canvas = container.querySelector('canvas')!
    this.ctx = this.canvas.getContext('2d')!
    this.columns = options.columns
    this.rowHeight = options.rowHeight
    this.headHeight = options.headHeight
    this.data = options.data
    this.columnWidths = options.columnWidths
    this.totalCount = options.totalCount

    //container.appendChild(this.canvas)

    this.ctx.imageSmoothingEnabled = true
    this.ctx.imageSmoothingQuality = 'high'

    this.calculateColumnLayout()
    this.initCanvas()
  }

  private initCanvas() {
    const resizeObserver = new ResizeObserver(() => {
      this.resizeCanvas()
    })
    resizeObserver.observe(this.canvas.parentElement!)
  }

  resizeCanvas(columnWidths?: any) {
    const container = this.canvas.parentElement!

    this._distY = container.clientHeight % this.rowHeight

    this.canvas.width = container.clientWidth * devicePixelRatio
    this.canvas.height = container.clientHeight * devicePixelRatio
    this.canvas.style.width = `${container.clientWidth}px`
    this.canvas.style.height = `${container.clientHeight}px`

    if (columnWidths) {
      this.columnWidths = { ...columnWidths }
      this.calculateColumnLayout()
    }

    this.ctx.font = `${this.fontSize}px ${this.fontFamily}`
    this.ctx.textBaseline = 'middle'

    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.scale(devicePixelRatio, devicePixelRatio)
    this.render()
  }

  // 计算列宽和位置
  private calculateColumnLayout() {
    let totalWidth = this.CheckboxColumnWidth
    this.columnXCache = []

    this.columns.forEach((col, index) => {
      this.columnXCache[index] = totalWidth
      const width = this.columnWidths[col.key] || 100
      totalWidth += width
    })

    this.canvas.style.width = `${totalWidth}px`
    this.canvas.width = totalWidth * this.devicePixelRatio
  }
  //更新数据总条数
  updateTotalCount(totalCount: number) {
    this.totalCount = totalCount
  }

  getColumnIndexByX(x: number) {
    let result = -1
    for (let i = 0; i < this.columns.length; i++) {
      const col = this.columns[i]!
      const startX = this.columnXCache[i]!
      const width = this.columnWidths[col.key]!
      if (x >= startX && x <= startX + width) {
        result = i
        break
      }
    }
    return result
  }

  getCellIndexFromClick(rect: any, clientX: number, clientY: number) {
    const x = clientX - rect.left
    const y = clientY - rect.top
    let startX = 0

    //if (y < this.headHeight) return { rowIndex: -1 }

    let rowIndex = -1
    const relativeY = y

    if (relativeY < 0) {
      return { colIndex: -2, rowIndex, startX }
    }

    const rawDivision = relativeY / this.rowHeight
    const floored = Math.floor(rawDivision)
    rowIndex = this._start + floored

    if (rowIndex < 0 || rowIndex > this.totalCount) {
      rowIndex = -1
    }

    let colIndex = -2

    if (x >= 0 && x < this.CheckboxColumnWidth) {
      //点击复选框列
      colIndex = -1
    } else {
      for (let i = 0; i < this.columns.length; i++) {
        const col = this.columns[i]!
        startX = this.columnXCache[i]!
        const width = this.columnWidths[col.key]!
        if (x >= startX && x <= startX + width) {
          colIndex = i
          break
        }
      }
    }

    return { colIndex, rowIndex, startX }
  }

  // 渲染可见区域
  render(visibleRange?: { start: number; end: number }, visibleData?: any[]) {
    if (!visibleRange) {
      // 全量渲染（仅用于初始化）
      visibleRange = {
        start: 0,
        end: Math.ceil(this.canvas.height / this.rowHeight) + 5,
      }
    }

    const { start, end } = visibleRange
    const visibleRows = visibleData || this.data.slice(start, end)
    this._start = start
    this.data = [...visibleRows]

    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawRect(0, 0, this.canvas.width, this.canvas.height)

    // 绘制表头
    //this.renderHeader()

    // 绘制数据行
    visibleRows.forEach((row, rowIndex) => {
      let isSelected = false
      let y = rowIndex * this.rowHeight
      if (start !== 0) {
        /***
         * 当canvas绘制可视区域高度不能和行高取整时，始终保持滚动时最后一行绘制完整，即第一行可以不完整处理
         * 首屏的第一行例外，要完整显示
         */
        //y = y - this._distY
      }
      if (this.selectedRows) {
        if (row.isGroup && this.selectedRows.has(row.name)) {
          isSelected = this.selectedRows.get(row.name).isSelected
        }
        if (this.selectedRows.has(row.rowId)) {
          isSelected = this.selectedRows.get(row.rowId).isSelected
        }
      }
      if (row.isGroup) {
        this.renderGroupRow(row, y, isSelected)
      } else {
        this.renderRow(row, y, isSelected)
      }
    })
  }

  private drawText(text: string, x: number, y: number, maxWidth?: number | null, color?: string) {
    // 处理长文本
    let displayText = text
    if (maxWidth && this.ctx.measureText(text).width > maxWidth - 16) {
      displayText = this.truncateText(text, maxWidth - 16)
    }

    const ax = Math.round(x * this.devicePixelRatio) / this.devicePixelRatio
    const ay = Math.round(y * this.devicePixelRatio) / this.devicePixelRatio

    this.ctx.fillStyle = color || 'rgb(113 113 122)'
    this.ctx.font = `${this.fontSize}px ${this.fontFamily}`
    this.ctx.fillText(displayText, ax, ay)
  }

  private truncateText(text: string, maxWidth: number): string {
    let result = text
    while (this.ctx.measureText(result + '...').width > maxWidth && result.length > 0) {
      result = result.slice(0, -1)
    }
    return result + '...'
  }

  private drawRect(x: number, y: number, width: number, height: number, isSelected: boolean = false) {
    this.ctx.strokeStyle = isSelected ? 'rgb(253 186 116)' : 'rgb(228 228 231)'
    this.ctx.lineWidth = isSelected ? 1 : 0.5

    const ax = Math.round(x * this.devicePixelRatio) / this.devicePixelRatio
    const ay = Math.round(y * this.devicePixelRatio) / this.devicePixelRatio
    const aWidth = Math.round(width * this.devicePixelRatio) / this.devicePixelRatio
    const aHeight = Math.round(height * this.devicePixelRatio) / this.devicePixelRatio

    this.ctx.strokeRect(ax, ay, aWidth, aHeight)
  }
  private drawBorder(direct: string, x: number, y: number, width: number, height: number, isSelected: boolean = false) {
    this.ctx.beginPath()
    switch (direct) {
      case 'top':
        //左上--右上
        this.ctx.moveTo(x, y)
        this.ctx.lineTo(x + width, y)
        break
      case 'bottom':
        //左下--右下
        this.ctx.moveTo(x, y + height)
        this.ctx.lineTo(x + width, y + height)
        break
      case 'left':
        //左上--左下
        this.ctx.moveTo(x, y)
        this.ctx.lineTo(x, y + height)
        break
      case 'right':
        //右上--右下
        this.ctx.moveTo(x + width, y)
        this.ctx.lineTo(x + width, y + height)
        break
      default:
        this.drawRect(x, y, width, height)
        break
    }

    this.ctx.lineWidth = isSelected ? 1 : 0.5
    this.ctx.strokeStyle = isSelected ? 'rgb(253 186 116)' : 'rgb(228 228 231)'
    this.ctx.stroke()
  }

  /**private renderHeader() {
    this.ctx.fillStyle = '#f5f5f5'
    this.ctx.fillRect(0, 0, this.canvas.width, this.headHeight)

    this.columns.forEach((col, index) => {
      const x = this.columnXCache[index]
      const width = this.columnWidths[col.key] || 100

      this.drawText(col.name, x + 8, this.headHeight / 2 + 5)

      //this.drawRect(x, 0, width, this.headHeight)
      this.drawBorder('bottom', x, 0, width, this.headHeight)
    })
  }*/

  private roundRect(x: number, y: number, width: number, height: number, radius: number | number[]) {
    let radii: number[]
    if (typeof radius === 'number') {
      radii = Array.from({ length: 4 }).map((_) => radius)
    } else {
      radii = [...radius]
      while (radii.length < 4) {
        radii.push(radii[radii.length - 1]!)
      }
    }

    const [tl, tr, bl, br] = radii
    this.ctx.beginPath()

    this.ctx.moveTo(x + tl!, y)

    this.ctx.lineTo(x + width - tr!, y)
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + tr!)

    this.ctx.lineTo(x + width, y + height - br!)
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - br!, y + height)

    this.ctx.lineTo(x + bl!, y + height)
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - bl!)

    this.ctx.lineTo(x, y + tl!)
    this.ctx.quadraticCurveTo(x, y, x + tl!, y)

    this.ctx.closePath()
  }

  private renderCheckboxCell(x: number, y: number, isSelected: boolean) {
    const boxSize = 14
    let width = 0
    let height = 0
    width = height = this.rowHeight
    const boxX = x + (width - boxSize) / 2
    const boxY = y + (height - boxSize) / 2

    //复选框单元格背景
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(x, y, width, height)

    //绘制复选框
    this.ctx.lineWidth = isSelected ? 1 : 0.5
    this.roundRect(boxX, boxY, boxSize, boxSize, 1)
    this.ctx.strokeStyle = isSelected ? 'rgb(253 186 116)' : 'rgb(161 161 170)'
    this.ctx.stroke()
    //this.ctx.strokeRect(boxX, boxY, boxSize, boxSize)

    if (isSelected) {
      //绘制勾选符号
      this.ctx.beginPath()
      this.ctx.moveTo(boxX + 4, boxY + 6)
      this.ctx.lineTo(boxX + 6, boxY + 10)
      this.ctx.lineTo(boxX + 10, boxY + 4)
      this.ctx.stroke()
      this.ctx.closePath()
    }
    //绘制单元格边框
    //this.drawRect(x, y, width, height, isSelected)
    this.drawBorder('bottom', x!, y, width, height, isSelected)
  }
  private renderRow(row: any, y: number, isSelected: boolean = false) {
    //const isEven = rowIndex % 2 === 0

    //绘制每行的复选框列
    this.renderCheckboxCell(0, y, isSelected)
    this.columns.forEach((col, colIndex) => {
      const x = this.columnXCache[colIndex]!
      const width = this.columnWidths[col.key] || 100
      const value = row[col.key]

      // 绘制背景
      this.ctx.fillStyle = isSelected ? 'rgb(255 237 213)' : '#ffffff'
      this.ctx.fillRect(x, y, width, this.rowHeight)

      // 绘制文本
      this.drawText(String(value || ''), x + 8, y + this.rowHeight / 2)

      // 绘制边框
      //this.drawRect(x, y, width, this.rowHeight)

      //绘制底部边框
      this.drawBorder('bottom', x, y, width, this.rowHeight, isSelected)
    })
  }
  renderSelectRow(selectedRows: Map<number, any>) {
    this.selectedRows = selectedRows
    if (selectedRows.size > this.data.length) {
      //全选时选中行数据过大
      this.data.forEach((row, rowIndex) => {
        if (selectedRows.has(row.rowId) || selectedRows.has(row.name)) {
          const status = row.isGroup ? selectedRows.get(row.name) : selectedRows.get(row.rowId)
          const y = rowIndex * this.rowHeight
          if (row.isGroup) {
            this.renderGroupRow(row, y, status.isSelected)
          } else {
            this.renderRow(row, y, status.isSelected)
          }
        }
      })
    } else {
      for (const [key, status] of selectedRows) {
        let rowIndex = -1
        if (status.isGroup) {
          //选中分组表头行
          rowIndex = this.data.findIndex((row) => row.name === key)
        } else {
          //选中普通行
          rowIndex = this.data.findIndex((row) => row.rowId === key)
        }
        if (rowIndex !== -1 && (!status.hasOwnProperty('change') || status.changed)) {
          const y = rowIndex * this.rowHeight
          const row = this.data[rowIndex]
          if (row.isGroup) {
            this.renderGroupRow(row, y, status.isSelected)
          } else {
            this.renderRow(row, y, status.isSelected)
          }
        }
      }
    }
  }
  //绘制分组头信息行
  private renderGroupRow(row: Record<string, any>, y: number, isSelected: boolean = false) {
    const width = this.canvas.width / this.devicePixelRatio - this.CheckboxColumnWidth
    const x = this.CheckboxColumnWidth
    //绘制分组头信息行的复选框列
    this.renderCheckboxCell(0, y, isSelected)
    // 绘制背景
    //this.ctx.fillStyle = 'rgb(255 247 237)'
    this.ctx.fillRect(x, y, width, this.rowHeight)

    // 绘制文本
    this.drawText(String(row.name || ''), x + 8, y + this.rowHeight / 2, null, 'rgb(253 186 116)')

    //绘制底部边框
    this.drawBorder('bottom', x, y, width, this.rowHeight, isSelected)
  }

  // 更新数据并重绘
  renderCell(x: number, y: number, changeData: { rowIndex: number; colKey: string; value: any }) {
    const { rowIndex, colKey, value } = changeData

    this.data[rowIndex][colKey] = value
    const width = this.columnWidths[colKey]!

    this.ctx.clearRect(x, y, width, this.rowHeight)

    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(x, y, width, this.rowHeight)

    this.drawText(String(value || ''), x + 8, y + this.rowHeight / 2)

    this.drawRect(x, y, width, this.rowHeight)
  }
}
