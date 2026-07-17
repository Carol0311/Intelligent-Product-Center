import request from './request'
import type { TableResponse, TargetGroupRequest, DeleteRowRequest, UpsertRowsRequest, LoadTableDataRequest } from 'public-shared'
export const initTableConfig = (data: any): Promise<TableResponse> =>
  request({
    url: '/api/table/initTable',
    method: 'post',
    data,
  })
export const upsertRow = (data: UpsertRowsRequest): Promise<TableResponse> =>
  request({
    url: '/api/table/upsertRow',
    method: 'post',
    data,
  })
export const deleteRow = (data: DeleteRowRequest): Promise<TableResponse> =>
  request({
    url: '/api/table/deleteRow',
    method: 'post',
    data,
  })
export const updateTableConfig = (data: any): Promise<TableResponse> =>
  request({
    url: '/api/table/updateTableConfig',
    method: 'post',
    data,
  })
export const loadTableConfig = (data: any): Promise<TableResponse> =>
  request({
    url: '/api/table/loadTableConfig',
    method: 'post',
    data,
  })
export const loadTableData = (data: LoadTableDataRequest): Promise<TableResponse> =>
  request({
    url: '/api/table/loadTableData',
    method: 'post',
    data,
  })
export const loadTargetGroup = (data: TargetGroupRequest): Promise<TableResponse> =>
  request({
    url: '/api/table/loadTargetGroup',
    method: 'post',
    data,
  })
