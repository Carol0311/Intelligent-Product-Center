<template>
  <div
    ref="tableContainer"
    v-bind="$attrs"
    class="smart-edit-table edit-table mt-2.5 table-container relative overflow-x-auto overflow-y-hidden"
    :class="{ 'border border-solid border-zinc-200': !visibleColumns || visibleColumns.length < 1 }"
    :style="{ ...data.props.inlineStyle, height: `${containerHeight + headHeight}px` }"
  >
    <div v-if="!visibleColumns || (visibleColumns && visibleColumns.length === 0)" class="empty-table text-center text-zinc-500 py-4 absolute">表格数据为空</div>
    <template v-else>
      <div class="table-header flex flex-row items-center border border-solid border-zinc-200 border-b-0 absolute" :style="{ 'line-height': headHeight + 'px' }">
        <div class="header-cell pl-2.5 relative" :style="{ width: '40px' }">
          <!--#if [PRODUCT]-->
          <ClientOnly>
            <PhSquare v-show="!selectAll" :size="20" weight="thin" class="text-zinc-400" @click="handleSelectAll" />
            <PhCheckSquare v-show="selectAll" :size="20" weight="thin" class="text-orange-300" @click="handleSelectAll" />
          </ClientOnly>
          <!--#endif-->
          <!--#if [LOWCODE]-->
          <PhSquare v-show="!selectAll" :size="20" weight="thin" class="text-zinc-400" @click="handleSelectAll" />
          <PhCheckSquare v-show="selectAll" :size="20" weight="thin" class="text-orange-300" @click="handleSelectAll" />
          <!--#endif-->
        </div>
        <div
          v-for="column in visibleColumns"
          :key="column.key"
          class="header-cell pl-2.5 text-zinc-500 relative"
          :style="{
            width: `${columnWidths[column.key]}px`,
          }"
        >
          <span>{{ column.name }}</span>
          <span class="resize-line cursor-ew-resize absolute h-full w-0.5 right-0 hover:bg-orange-300" @mousedown="(e) => handleColumnResize(e, column)"></span>
        </div>
      </div>
      <div v-show="isLoading && !isLoadCompleted" class="absolute text-orange-300 flex items-center justify-center loading" :style="{ top: `${headHeight}px` }">
        <!--#if [PRODUCT]-->
        <ClientOnly>
          <PhSpinner :size="16" weight="regular" class="loading-ani" />
        </ClientOnly>
        <!--#endif-->
        <!--#if [LOWCODE]-->
        <PhSpinner :size="16" weight="regular" class="loading-ani" />
        <!--#endif-->
        <span class="pl-2 text-sm">数据加载中...</span>
      </div>
      <div
        ref="scrollWrapper"
        class="absolute table-scroll-track overflow-auto"
        :style="{ height: `${containerHeight}px`, top: `${headHeight}px` }"
        @scroll="handleScrollEvt"
        @click="handleCanvasClick"
      >
        <div class="placeholder-scroller relative" :style="{ height: `${totalHeight}px` }"></div>
      </div>
      <div ref="canvasWrapperRef" class="canvas-wrapper pointer-events-none" :style="{ height: `${containerHeight}px`, top: `${headHeight}px` }">
        <canvas ref="canvasRef" class="pointer-events-none" />
      </div>
    </template>
  </div>
  <Teleport :to="editingCellClass">
    <FloatingEditor v-if="!!activeEditCell" :active-edit-cell="activeEditCell" class="fixed" :style="activeEditCellStyle" @cell-editor-change="handleEditorChange" />
  </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { isEqual } from 'lodash-es'
import { PhSquare, PhCheckSquare, PhSpinner } from '@phosphor-icons/vue'
import { ref, onMounted, watch, toRaw, computed } from 'vue'
import { throttle } from 'lodash-es'
import { useUiConfig } from '@shared/composables/useUiConfig'
import FloatingEditor from './FloatingEditor.vue'
import { LayoutManager } from './core/LayoutManager'
import { useTableWorker } from './composables/useTableWorker'
import { useVirtualTable } from './composables/useVirtualTable'
import { useElementResize } from '@shared/composables/useElementResize'
import { useRowSelection } from './composables/useRowSelection'
import { CanvasTableRender } from './core/CanvasTableRender'
import { initTableConfig } from '@shared/http/tableApi'
import type { ComponentSchema, ColumnSchema } from '@shared/schema'

const { initWorker, sendMessage } = useTableWorker()

// #if [LOWCODE]
//@ts-ignore - 仅在lowcode构建时存在
import { useEditorStore, useTableStore } from '@/stores'
const editorStore = useEditorStore()
//@ts-ignore - 仅在lowcode构建时存在
const { updateComponent } = editorStore
//@ts-ignore - 仅在lowcode构建时存在
const { currentPage } = storeToRefs(editorStore)
//@ts-ignore - 仅在lowcode构建时存在
const tableStore = useTableStore()
//@ts-ignore - 仅在lowcode构建时存在
const { setColumn, setConfig } = tableStore
//@ts-ignore - 仅在lowcode构建时存在
const { columns, configs } = storeToRefs(tableStore)
// #endif

// #if [PRODUCT]
//@ts-ignore - 仅在product构建时存在
import { usePageStore, useTableStore } from '@/stores'
const pageStore = usePageStore()
//@ts-ignore - 仅在product构建时存在
const { updateComponent } = pageStore
//@ts-ignore - 仅在product构建时存在
const { currentPage } = storeToRefs(pageStore)
//@ts-ignore - 仅在product构建时存在
const tableStore = useTableStore()
//@ts-ignore - 仅在product构建时存在
const { setColumn, setConfig } = tableStore
//@ts-ignore - 仅在product构建时存在
const { columns, configs } = storeToRefs(tableStore)
// #endif

const emits = defineEmits(['model-change'])
const selectAll = ref(false)
const expandGroup = ref<string[]>([])
let canvasRender: CanvasTableRender
let rowSelection: any = null
//const canvasTableRef = ref<HTMLElement>()
const props = defineProps<{
  data: ComponentSchema
}>()
useUiConfig(props.data.id)

const activeEditCell = ref<{
  rowId: number
  editKey: string
  component: ColumnSchema
  value?: any
} | null>(null)
const activeEditCellStyle = ref<Record<string, any>>({})

let editingCellClass = 'body'

//表格组件容器
const tableContainer = ref<HTMLElement | null>(null)
const canvasWrapperRef = ref<HTMLElement>()

const scrollWrapper = ref<HTMLElement>()

//默认行高
const rowHeight = ref(40)
//默认表头高度
const headHeight = ref(40)
//默认表格高度
const containerHeight = ref<number>(200)
//表格配置数据
const tableConfig = ref<Record<string, any>>(props.data.props.tableConfig)
//获取表格列设置设局
const visibleColumns = ref<ColumnSchema[] | null>(null)

/**const visibleColumns = computed(() => {
  return columns.value[props.data.id] || []
})*/

const totalCount = ref<number>(0)
const totalHeight = ref<number>(0)
const visibleRowsData = ref<any[]>([])
//表格数据是否全部加载结束
const isLoadCompleted = ref<boolean>(true)
//数据加载中
const isLoading = ref<boolean>(false)
//首屏数据量
let initCounts = 0

/***表格自适应处理start***/
let tableLayout: any = null
const columnWidths = ref<Record<string, number>>({})

// 虚拟滚动处理
const { offsetY, visibleRange, isFastScrolling, handleScroll, updateTotalRows } = useVirtualTable({
  rowHeight: 40,
  totalRows: totalCount.value,
  overscanCount: 0,
  mode: 'CANVAS',
})

onMounted(async () => {
  //加载表格配置
  await loadTableConfig()
  if (!visibleColumns.value || (visibleColumns.value && visibleColumns.value.length === 0)) return

  isLoading.value = false
  tableLayout = new LayoutManager(visibleColumns.value, tableContainer.value!, headHeight.value)

  //初始化表格列
  columnWidths.value = { ...tableLayout.getColumnWidths() }
  //初始化表格高度
  if (props.data.props.inlineStyle?.height) {
    let h = props.data.props.inlineStyle.height
    h = tableLayout.parseSize(h, tableContainer.value?.parentElement?.clientHeight!)
    containerHeight.value = Math.floor(h / rowHeight.value) * rowHeight.value - headHeight.value
  } else {
    containerHeight.value = tableLayout.getTableHeight()
  }
  //初始化table worker处理数据
  initWorker()

  //加载表格首屏数据
  const action = tableConfig.value.isGroup ? 'INIT_GROUP_FIRST' : 'INIT_FIRST'
  const actionParams = {
    config: toRaw(tableConfig.value),
    overscanCount: 20,
  }
  await sendMessage(action, actionParams).then((result) => {
    isLoadCompleted.value = false
    if (tableConfig.value.isGroup) {
      initCounts = result.initCounts
    }
    visibleRowsData.value = result.data
    //if (!canvasTableRef.value) return
    canvasRender = new CanvasTableRender(canvasWrapperRef.value!, {
      columns: toRaw(visibleColumns.value),
      rowHeight: rowHeight.value,
      headHeight: headHeight.value,
      data: toRaw(visibleRowsData.value),
      columnWidths: toRaw(columnWidths.value),
      totalCount: result.totalCount,
    })
    updateScrollHeight(result.totalCount, result.totalGroupNames)
    canvasRender.render(visibleRange.value, toRaw(visibleRowsData.value))
    rowSelection = useRowSelection(totalCount)
  })
  //表格非首屏数据处理
  const second_action = tableConfig.value.isGroup ? 'INIT_GROUP_TOTAL' : 'INIT_REST'
  sendMessage(second_action, { config: toRaw(tableConfig.value) }).then((result) => {
    updateScrollHeight(result.totalCount, result.totalGroupNames)
    isLoadCompleted.value = true
  })
})

//获取表格配置
const loadTableConfig = async () => {
  if (!tableConfig.value) return
  await initTableConfig({
    tableId: props.data.id,
    pageId: currentPage.value?.pageId,
    ...tableConfig.value,
  }).then((res) => {
    if (res.success && res.data) {
      //visibleColumns.value = res.data.columns
      tableConfig.value = res.data.tableConfig
      setColumn(props.data.id, res.data.columns)
      setConfig(props.data.id, tableConfig.value)
      updateComponent(props.data.id, { tableConfig: tableConfig.value })
    }
  })
}

//重置滚动高度，分组信息
const updateScrollHeight = (counts: number, groupNames?: string[]) => {
  totalCount.value = counts
  totalHeight.value = totalCount.value * rowHeight.value
  if (groupNames) {
    expandGroup.value = groupNames
  }
  //虚拟滚动更新数据总条数
  updateTotalRows(totalCount.value)
  //canvas渲染更新数据总条数
  canvasRender.updateTotalCount(totalCount.value)
}

//表格自适应resize处理
let isResizing = false
const handleResize = throttle(() => {
  //防止循环调用
  if (isResizing) return

  isResizing = true

  try {
    let hasChange = false

    tableLayout.resize(tableContainer.value?.clientWidth!)
    const newWidth = tableLayout.getColumnWidths()
    for (const key in newWidth) {
      if (columnWidths.value[key] !== newWidth[key]) {
        hasChange = true
        break
      }
    }
    if (hasChange) {
      columnWidths.value = { ...newWidth }
    }
  } catch (e) {
  } finally {
    setTimeout(() => {
      isResizing = false
    }, 50)
  }
}, 100)

useElementResize(tableContainer, handleResize)

//列拖拽设置宽度处理
const handleColumnResize = (e: MouseEvent, col: ColumnSchema) => {
  let rafId: number | null = null
  const startX = e.clientX
  const startWidth = columnWidths.value[col.key]!

  const onMouseMove = (e: MouseEvent) => {
    const dist = e.clientX - startX
    const newColWidth = Math.max(70, startWidth + dist)
    const newWidth = tableLayout.resizeColumn(col.key, Math.round(newColWidth))

    if (rafId) {
      cancelAnimationFrame(rafId)
    }

    //requestAnimationFrame节流
    rafId = requestAnimationFrame(() => {
      columnWidths.value = { ...newWidth }
      rafId = null
    })
  }
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    canvasRender.resizeCanvas(toRaw(columnWidths.value))
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}
/***表格自适应处理end***/

//可编辑单元格点击加载对应组件事件
const handleStartEdit = ({ rowId, colKey, value, position }: any) => {
  if (!visibleColumns.value) return
  const index = visibleColumns.value.findIndex((column: ColumnSchema) => column.key === colKey)
  if (index === -1) return
  const column = visibleColumns.value[index]!
  if (column.props.readonly) return
  activeEditCell.value = {
    rowId,
    editKey: `${rowId}_${colKey}`,
    value,
    component: column,
  }
  editingCellClass = `[data-id="${props.data.id}"] .cell_${rowId}_${index}`
}
//可编辑单元格数据变化事件处理
const handleEditorChange = (changeData: Record<string, any>) => {
  isLoading.value = false
  const action = tableConfig.value.isGroup ? 'UPDATE_CELL_IN_GROUP' : 'UPDATE_CELL'
  sendMessage(action, changeData).then((result) => {
    const index = visibleRowsData.value.findIndex((r) => r.rowId === result.rowId)
    if (index !== -1) {
      visibleRowsData.value[index] = result.updatedRow
      if (activeEditCell.value) {
        const x = Number(activeEditCellStyle.value.left.replace('px', ''))
        const y = Number(activeEditCellStyle.value.top.replace('px', ''))
        canvasRender.renderCell(x, y - rowHeight.value, {
          rowIndex: index,
          colKey: changeData.colKey,
          value: changeData.value,
        })
      }
    }
    //数据变化
    /**emits('model-change', {
      isTable:true,
      rowIndex: index,
      colKey: changeData.colKey,
      value: changeData.value,
    })*/
  })
}
const handleScrollEvt = (e: Event) => {
  isLoading.value = false
  activeEditCellStyle.value = { ...activeEditCellStyle.value, opacity: 0 }
  handleScroll(e)
}
//canvas单击处理
const handleCanvasClick = async (e: MouseEvent) => {
  isLoading.value = false
  // #if [PRODUCT]
  if (!visibleColumns.value) return
  activeEditCell.value = null
  activeEditCellStyle.value = {}
  const rect = scrollWrapper.value?.getBoundingClientRect()
  const { rowIndex, colIndex, startX } = canvasRender.getCellIndexFromClick(rect, e.clientX, e.clientY)

  if (colIndex === -2 || rowIndex === -1) return
  let rowData = null
  if (tableConfig.value.isGroup) {
    await sendMessage('GET_ROW_IN_GROUP', { rowIndex }).then((res) => {
      rowData = res.data
    })
  } else {
    rowData = visibleRowsData.value.find((row) => row.rowId === rowIndex)
  }
  if (!rowData || (rowData.isGroup && colIndex !== -1)) return

  if (colIndex === -1) {
    //复选框单元格点击--正反选
    if (rowData.isGroup) {
      rowSelection.toggleGroupRows(rowData.name, rowData.ids, true)
    } else {
      rowSelection.toggleRow(rowData.rowId, true)
    }
  } else {
    //非复选框单元格点击--不反选
    rowSelection.toggleRow(rowData.rowId, false)

    const column = visibleColumns.value[colIndex]
    if (!rowData.isGroup && column && !column.props.readonly) {
      //对应可编辑组件加载
      activeEditCell.value = {
        rowId: rowData.rowId,
        editKey: `${rowData.rowId}_${column.key}`,
        value: rowData[column.key],
        component: column,
      }
      editingCellClass = `[data-id="${props.data.id}"]`
      activeEditCellStyle.value = {
        top: `${1 + rowHeight.value * Math.max(rowIndex - visibleRange.value.start + 1, 0)}px`,
        left: `${startX}px`,
        width: `${columnWidths.value[column.key]}px`,
        height: `${rowHeight.value - 2}px`,
        zIndex: 3,
      }
    }
  }
  //重绘选中行
  canvasRender.renderSelectRow(rowSelection.selectedRows.value)
  // #endif
}

//全选与反全选
const handleSelectAll = () => {
  selectAll.value = !selectAll.value
  if (selectAll.value) {
    rowSelection.selectAll()
    canvasRender.renderSelectRow(rowSelection.selectedRows.value)
  } else {
    rowSelection.clearSelection()
    canvasRender.render(visibleRange.value, toRaw(visibleRowsData.value))
  }
}

const resetFloatEdit = () => {
  if (!activeEditCell.value) return
  const rowId = activeEditCell.value?.rowId
  const index = visibleRowsData.value.findIndex((row) => row && row.rowId === rowId)
  if (index !== -1) {
    activeEditCellStyle.value = {
      ...activeEditCellStyle.value,
      top: `${rowHeight.value * (index + 1)}px`,
    }
  }
  activeEditCellStyle.value = {
    ...activeEditCellStyle.value,
    opacity: index === -1 ? 0 : 1,
  }
}
//监听滚动范围变化，canvas重绘可视范围数据行
watch([visibleRange, isLoadCompleted], async ([newRange, isCompleted], [oldRange, _]) => {
  if (!isEqual(newRange, oldRange)) {
    const action = tableConfig.value.isGroup ? 'SCROLL_GROUP' : 'SCROLL'
    const actionParams = tableConfig.value.isGroup ? { ...toRaw(newRange), expandGroup: toRaw(expandGroup.value) } : toRaw(newRange)
    //如果分组表格滚动到的位置数据还未加载完，等待完成之后再重绘
    if (tableConfig.value.isGroup && !isCompleted && newRange.end > initCounts) {
      isLoading.value = true
    } else {
      isLoading.value = false
      sendMessage(action, actionParams).then((result) => {
        if (result.start === newRange.start && result.end === newRange.end) {
          visibleRowsData.value = result.data
          if (canvasRender && visibleRowsData.value.length > 0) {
            canvasRender.render(visibleRange.value, toRaw(visibleRowsData.value))
          }
        }
      })
    }
  }
  resetFloatEdit()
})
watch(
  () => columns && columns.value[props.data.id],
  (newColumns, oldColumns) => {
    if (newColumns) {
      visibleColumns.value = newColumns
      if (newColumns && oldColumns && newColumns.length > 0 && oldColumns.length > 0) {
        //如果顺序改变，可视区域需要重绘
        const n_keys = newColumns.map((c: ColumnSchema) => c.key)
        const o_keys = oldColumns.map((c: ColumnSchema) => c.key)
        if (canvasRender && !isEqual(n_keys, o_keys)) {
          canvasRender.updateColumns(toRaw(newColumns))
          canvasRender.reRenderVisible()
        }
      }
    }
  }
)
</script>
<style>
.table-container .table-header {
  z-index: 3;
}
.empty-table {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.table-container .table-header .header-cell {
  display: inline-block;
}
.table-container .table-header span {
  user-select: none;
}
.table-container .table-scroll-track {
  top: 0;
  width: 100%;
  left: 0;
  bottom: 0;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background: transparent;
  z-index: 2;
}
.table-container .table-scroll-track:hover {
  opacity: 0.5;
}
.table-container .placeholder-scroller {
  width: 100%;
}
.table-container .canvas-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  overflow: hidden;
  transform: translateZ(0);
  will-change: transform;
  min-width: 100%;
}
.table-container .canvas-wrapper canvas {
  width: 100%;
  height: 100%;
  display: block;
  image-rendering: pixelated;
}
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .table-container .canvas-wrapper canvas {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
}
.table-container .loading {
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.5);
  z-index: 3;
}
.loading-ani {
  animation: loading-rotate 1s infinite linear;
}
@keyframes loading-rotate {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
