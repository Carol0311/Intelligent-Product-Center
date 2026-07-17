// domain/editor/operation-transformer.ts
import type { EditorCommand } from 'public-shared'

/**
 * 操作变换（Operational Transformation）
 * 用于协同编辑解决冲突
 */
export class OperationTransformer {
  /**
   * 变换两个并发操作
   */
  static transform(
    commandA: EditorCommand,
    commandB: EditorCommand,
  ): [EditorCommand, EditorCommand] {
    // 如果操作不相关，直接返回
    if (!this.areConflicting(commandA, commandB)) {
      return [commandA, commandB]
    }

    // 根据操作类型进行变换
    switch (`${commandA.type}-${commandB.type}`) {
      case 'COMPONENT_MOVE-COMPONENT_MOVE':
        return this.transformMoveMove(commandA, commandB)
      case 'COMPONENT_UPDATE-COMPONENT_UPDATE':
        return this.transformUpdateUpdate(commandA, commandB)
      // 其他冲突情况...
      default:
        // 默认策略：保留时间戳更晚的操作
        if (commandA.timestamp > commandB.timestamp) {
          return [commandA, this.adjustCommandForConflict(commandB, commandA)]
        } else {
          return [this.adjustCommandForConflict(commandA, commandB), commandB]
        }
    }
  }

  static areConflicting(cmdA: EditorCommand, cmdB: EditorCommand): boolean {
    // 检查是否操作同一个组件
    const getTargetId = (cmd: EditorCommand): string | null => {
      const payload = cmd.payload as any
      return payload.componentId || payload.component?.id || null
    }

    const idA = getTargetId(cmdA)
    const idB = getTargetId(cmdB)

    return idA !== null && idB !== null && idA === idB
  }

  private static transformMoveMove(
    cmdA: EditorCommand,
    cmdB: EditorCommand,
  ): [EditorCommand, EditorCommand] {
    const payloadA = cmdA.payload as any
    const payloadB = cmdB.payload as any

    // 如果移动的目标位置不同，可以同时应用
    if (payloadA.toParentId !== payloadB.toParentId) {
      return [cmdA, cmdB]
    }

    // 调整索引
    const adjustedA = { ...payloadA }
    const adjustedB = { ...payloadB }

    if (payloadA.toIndex < payloadB.toIndex) {
      adjustedB.toIndex -= 1
    } else if (payloadA.toIndex > payloadB.toIndex) {
      adjustedA.toIndex -= 1
    }

    return [
      { ...cmdA, payload: adjustedA },
      { ...cmdB, payload: adjustedB },
    ]
  }

  private static adjustCommandForConflict(
    conflictedCmd: EditorCommand,
    winningCmd: EditorCommand,
  ): EditorCommand {
    // 标记冲突的命令
    return {
      ...conflictedCmd,
      metadata: {
        ...conflictedCmd.metadata,
        conflicted: true,
        resolvedBy: winningCmd.id,
      },
    }
  }
  private static transformUpdateUpdate(
    cmdA: EditorCommand,
    cmdB: EditorCommand,
  ): [EditorCommand, EditorCommand] {
    const payloadA = cmdA.payload as any
    const payloadB = cmdB.payload as any

    // 合并更新内容
    const mergedUpdatesA = { ...payloadA.updates }
    const mergedUpdatesB = { ...payloadB.updates }

    for (const key in mergedUpdatesA) {
      if (key in mergedUpdatesB) {
        // 冲突字段，采用时间戳更晚的更新
        if (cmdA.timestamp > cmdB.timestamp) {
          delete mergedUpdatesB[key]
        } else {
          delete mergedUpdatesA[key]
        }
      }
    }

    return [
      { ...cmdA, payload: { ...payloadA, updates: mergedUpdatesA } },
      { ...cmdB, payload: { ...payloadB, updates: mergedUpdatesB } },
    ]
  }
}
