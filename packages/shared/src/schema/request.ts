/**
 * 请求参数和响应参数类型
 */
import type { ComponentSchema } from './component'
// project schema
export interface ProjectSchema {
  id: string
  name: string
  pages: Record<string, PageSchema>
  homePageId: string
}
//反序列化PageSchema
export interface PageSchema {
  id: string
  pageId: string
  name: string
  rootComponentIds: string[] //页面根节点id
  components: Record<string, ComponentSchema> //存放id-->nodes映射
  selectId?: string //当前选中组件id
  create_at?: Date
  update_at?: Date
}
//反序列化FieldsSchema
export interface FieldsSchema {
  id: string
  pageId: string
  datas: Record<string, any> //存放页面字段数据
  create_at?: Date
  update_at?: Date
}
//获取页面列表
export interface PageListRequest {
  page?: string
  pageSize?: string
}
export interface PageListResponse {
  success: boolean
  message?: string
  data?: {
    currentPage: string
    totalPage: number | string | undefined
    pageList: PageSchema[]
  }
}
//新增页面
export interface CreatePageRequest {
  id?: string
  pageId?: string
  name: string
  rootComponentIds?: string[]
  components?: Record<string, ComponentSchema>
  selectId?: string
  create_at?: Date
  update_at?: Date
}
export interface PageResponse {
  success: boolean
  message?: string
  data?: PageSchema
}
export interface PageDataResponse {
  success: boolean
  message?: string
  data?: FieldsSchema
}
//获取页面详情
export interface PageDetlRequest {
  pageId: string
}
//删除页面
export interface PageDeleteRequest {
  pageId: string
}
export interface PageDeleteResponse {
  success: boolean
  message: string
  type: string
}
//地址级联
export interface AddressList {
  id: string
  parentid: string
  name: string
  children?: []
}
export interface AddressResponse {
  success: boolean
  message?: string
  data?: AddressList[]
}
export interface ReplyData {
  reply: string
  completed: boolean
  progress: number
  schema?: Record<string, any>
  collectedParams?: Record<string, any>
  templateInit?: Record<string, any> | null
}
/**AI多轮对话schema*/
export interface ChatResponse {
  success: boolean
  message?: string
  data?: ReplyData
}
export interface SessionListResponse {
  success: boolean
  message?: string
  data?: {
    list: any[]
    total: number
  }
}
export interface SessionResponse {
  success: boolean
  message?: string
  data?: {
    session: Record<string, any>
    messages: any[]
    params?: Record<string, any>
    formId: string | null
  }
}
