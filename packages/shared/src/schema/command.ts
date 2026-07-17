// domain/schema/command.ts
import type { ComponentType } from './index'
import { generateId } from '@shared/utils/index'
export interface EditorCommand {
  id: string // 命令唯一ID（用于去重和协同）
  type: CommandType
  timestamp: number // 客户端时间戳
  clientId?: string // 客户端ID（协同编辑用）
  sequence?: number // 命令序列号（用于OT）
  payload: CommandPayload
  metadata?: {
    userId?: string
    sessionId?: string
    conflicted: boolean // 是否为冲突命令
    device?: string
    resolvedBy: string // 解决冲突的命令ID
  }
}

export type CommandType =
  | 'COMPONENT_CREATE'
  | 'COMPONENT_UPDATE'
  | 'COMPONENT_UPDATE_CHILDREN'
  | 'COMPONENT_DELETE'
  | 'COMPONENT_MOVE'
  | 'COMPONENT_DUPLICATE'
  | 'COMPONENT_CUT'
  | 'COMPONENT_DROP'
  | 'BATCH'

export type CommandPayload =
  | ComponentCreatePayload
  | ComponentUpdatePayload
  | ComponentDeletePayload
  | ComponentMovePayload
  | ComponentDuplicatePayload
  | ComponentCutPayload
  | ComponentDropPayload
  | BatchPayload
// 创建组件的payload
export interface ComponentCreatePayload {
  componentId: string
  parentId: string
  type: ComponentType
}
// 更新组件的payload
export interface ComponentUpdatePayload {
  componentId: string
  updates?: Record<string, any>
  isChange?: boolean
  children?: any[]
  // 记录具体变更（用于操作日志）
  changes?: Record<string, { old: any; new: any }>
}
// 删除组件的payload
export interface ComponentDeletePayload {
  componentId: string
  selectId: string | undefined
  parentId: string
}
// 移动组件的payload
export interface ComponentMovePayload {
  componentId: string
  dropId: string
  dropPosition: 'top' | 'bottom' | 'left' | 'right'
}
//  复制组件的payload
export interface ComponentDuplicatePayload {
  componentId: string
  parentId: string
  create?: boolean
}
//切割容器组件的payload
export interface ComponentCutPayload {
  componentId: string
  parentId: string
  type: string //children|sibling
  direct: string //row|column
}
//拖拽原子组件到放置区域的payload
export interface ComponentDropPayload {
  dropId: string
  type: ComponentType
  defaultProps?: Record<string, any>
}
// 批量命令的payload
export interface BatchPayload {
  commands: EditorCommand[]
}
// 命令payload映射
export type CommandPayloadMap = {
  COMPONENT_CREATE: ComponentCreatePayload
  COMPONENT_DELETE: ComponentDeletePayload
  COMPONENT_UPDATE: ComponentUpdatePayload
  COMPONENT_UPDATE_CHILDREN: ComponentUpdatePayload
  COMPONENT_MOVE: ComponentMovePayload
  COMPONENT_DUPLICATE: ComponentDuplicatePayload
  COMPONENT_CUT: ComponentCutPayload
  COMPONENT_DROP: ComponentDropPayload
  BATCH: BatchPayload
}

// 命令工厂函数
export function createCommand<T extends CommandType>(type: T, payload: CommandPayloadMap[T], options?: Partial<EditorCommand>): EditorCommand {
  return {
    id: generateId(),
    type,
    timestamp: Date.now(),
    payload: payload as any,
    ...options,
  }
}

// 逆向命令（用于撤销）
export function invertCommand(command: EditorCommand): EditorCommand | null {
  switch (command.type) {
    case 'COMPONENT_CREATE': //撤销新创建的组件即为删除对应组件
      return createCommand('COMPONENT_DELETE', {
        componentId: (command.payload as ComponentCreatePayload).componentId,
        selectId: undefined,
        parentId: (command.payload as ComponentCreatePayload).parentId,
      })
    case 'COMPONENT_DELETE':
      // 需要原始数据，这里简化处理
      return null
    // ... 其他类型的逆向
  }
  return null
}
