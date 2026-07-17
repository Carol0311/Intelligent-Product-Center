// domain/operations/operation-log.ts
import type { EditorCommand, CommandType } from '@shared/schema/command'
import { generateId } from '@shared/utils/index'
const extractChanges = (command: EditorCommand): Record<string, { old: any; new: any }> => {
  const payload = command.payload as any
  switch (command.type) {
    case 'COMPONENT_UPDATE':
      return payload.changes || {}
    case 'COMPONENT_CREATE':
      return { created: { old: null, new: payload.component } }
    case 'COMPONENT_DELETE':
      return { deleted: { old: payload.component, new: null } }
    case 'COMPONENT_MOVE':
      return {
        fromParentId: { old: payload.fromParentId, new: payload.toParentId },
      }
    case 'COMPONENT_DUPLICATE':
      return { duplicatedFrom: { old: payload.sourceId, new: payload.componentId } }
    case 'BATCH':
      const changes: Record<string, { old: any; new: any }> = {}
      for (const cmd of payload.commands) {
        Object.assign(changes, extractChanges(cmd))
      }
      return changes
    default:
      return {}
  }
}
export interface OperationLog {
  id: string
  type: CommandType
  entityType: 'COMPONENT' | 'PAGE' | 'PROJECT'
  entityId: string
  changes: Record<string, { old: any; new: any }>
  timestamp: number
  userId: string
  sessionId: string
  synced: boolean
  version: number // 用于冲突检测
}

// 从命令生成操作日志
export function commandToOperationLog(command: EditorCommand, userId: string, sessionId: string): OperationLog {
  return {
    id: generateId(),
    type: command.type,
    entityType: 'COMPONENT',
    entityId: (command.payload as any).componentId || 'batch',
    changes: extractChanges(command),
    timestamp: command.timestamp,
    userId,
    sessionId,
    synced: false,
    version: 1,
  }
}
