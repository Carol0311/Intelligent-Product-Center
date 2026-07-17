/**
 * 非编辑器区域请求
 */
import request from './request'
import type { AddressResponse } from 'public-shared'

/*********************Address组件相关请求api************************************/
//获取省份数据
export const getProvince = (): Promise<AddressResponse> =>
  request({
    url: '/api/province',
    method: 'get',
  })

//获取城市数据
export const getCity = (params: any): Promise<AddressResponse> =>
  request({
    url: `/api/city`,
    method: 'get',
    params,
  })

//获取区县数据
export const getDistrict = (params: any): Promise<AddressResponse> =>
  request({
    url: `/api/district`,
    method: 'get',
    params,
  })

//获取街道乡镇数据
export const getCounty = (params: any): Promise<AddressResponse> =>
  request({
    url: `/api/county`,
    method: 'get',
    params,
  })
