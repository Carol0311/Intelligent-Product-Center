//调用后端 AI 服务（或 OpenAI / 自建推理服务等）
import { request } from 'public-shared'
import type {
  ChatResponse,
  PageDeleteResponse,
  SessionListResponse,
  SessionResponse,
} from 'public-shared'
export const startChat = (data: any): Promise<ChatResponse> =>
  request({
    url: '/api/ai/startChat',
    method: 'post',
    data,
  })
export const continueChat = (data: any): Promise<ChatResponse> =>
  request({
    url: '/api/ai/continueChat',
    method: 'post',
    data,
  })
export const deleteChat = (params: any): Promise<PageDeleteResponse> =>
  request({
    url: '/api/ai/deleteChat',
    method: 'delete',
    params,
  })
export const getChat = (params: any): Promise<SessionResponse> =>
  request({
    url: '/api/ai/getChat',
    method: 'get',
    params,
  })
export const updateChatTitle = (data: any): Promise<ChatResponse> =>
  request({
    url: '/api/ai/updateChatTitle',
    method: 'post',
    data,
  })
export const getChatHistoryList = (params: any): Promise<SessionListResponse> =>
  request({
    url: '/api/ai/getChatHistoryList',
    method: 'get',
    params,
  })
