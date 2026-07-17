/**
 * 编辑器区域请求
 */
import request, { updateService } from './request'
import type { PageListResponse, PageResponse, PageDeleteResponse, PageDataResponse } from 'public-shared'

/*********************页面操作请求api*************************************/

//获取页面列表
export const getPageList = (): Promise<PageListResponse> =>
  request({
    url: '/api/getPageList',
    method: 'get',
  })
// #if [LOWCODE]
//新增页面
export const createPage = (data: any): Promise<PageResponse> =>
  request({
    url: '/api/createPage',
    method: 'post',
    data,
  })
//删除页面
export const deletePage = (params: any): Promise<PageDeleteResponse> =>
  request({
    url: '/api/deletePage',
    method: 'delete',
    params,
  })
// #endif

//更新页面
export const updatePage = (data: any): Promise<PageResponse> =>
  request({
    url: '/api/updatePageInfo',
    method: 'post',
    data,
  })
//保存页面
export const savePage = (data: any): Promise<PageResponse> =>
  request({
    url: '/api/savePage',
    method: 'post',
    data,
  })

//获取页面详情
export const getPageDetail = (data: any): Promise<PageResponse> =>
  request({
    url: '/api/getPageDetail',
    method: 'post',
    data,
  })

//获取页面数据
export const loadPageData = (data: any): Promise<PageDataResponse> =>
  request({
    url: '/api/loadPageData',
    method: 'post',
    data,
  })

//更新页面数据
export const updateValue = (data: any): Promise<PageDataResponse> =>
  request({
    url: '/api/updateValue',
    method: 'post',
    data,
  })
//按钮点击事件
export const buttonClick = (params: any): Promise<any> =>
  request({
    url: `/api/buttonClick`,
    method: 'post',
    data: params,
  })
