/**表格操作shcema**/
export interface CreateTableRequest {
  tableId: string
  pageId: string
  columns: any[]
}
export interface TableResponse {
  success: boolean
  message?: string
  data?: Record<string, any>
}
export interface UpsertRowsRequest {
  rowData: Record<string, any>
  position?: number
}
export interface DeleteRowRequest {
  instanceId: string
  rowCode: string
  rowId: number
}
/**
 * start默认为0，从目标表格第一行开始取数据
 * limit默认为3000，默认每次请求3000条数据
 */
export interface LoadTableDataRequest {
  instanceId: string
  start?: number
  limit?: number
}
export interface TargetGroupRequest {
  instanceId: string
  limit: number //默认为0，不限制返回条数
  groupIndex: number //默认为0，取出的是第一组
  groupBy: Record<string, any>
}
