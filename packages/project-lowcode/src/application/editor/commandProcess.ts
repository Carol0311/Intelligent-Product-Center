// application/editor/command-processor.ts
import { TreeManager } from '@/domain/editor/treeManager'
import { OperationTransformer } from '@/domain/editor/opsTransformer'
import type { EditorCommand, PageSchema } from 'public-shared'
//工厂模式
export class CommandProcessor {
  private pendingCommands: EditorCommand[] = []
  private sequenceNumber = 0

  /**
   * 处理命令（主入口）
   */
  async process(
    page: PageSchema,
    command: EditorCommand,
    options: {
      immediate?: boolean // 是否立即应用
      syncToServer?: boolean // 是否同步到服务端
      trackHistory?: boolean // 是否记录历史
    } = {},
  ): Promise<{
    success: boolean
    newPage?: PageSchema
    transformedCommand?: EditorCommand
    error?: string
  }> {
    try {
      // 1. 验证命令
      if (!this.validateCommand(command, page)) {
        return { success: false, error: 'Invalid command' }
      }

      // 2. 分配序列号（用于协同编辑）
      const sequencedCommand = this.assignSequence(command)

      // 3. 应用变换（如果有未处理的操作）
      const transformedCommand = this.applyTransformation(sequencedCommand)

      // 4. 执行命令
      const newPage = TreeManager.execute(page, transformedCommand)

      // 5. 根据选项处理后续
      if (options.immediate !== false) {
        this.pendingCommands.push(transformedCommand)
      }

      if (options.syncToServer) {
        await this.syncToServer(transformedCommand)
      }

      if (options.trackHistory) {
        this.addToHistory(transformedCommand)
      }

      return {
        success: true,
        newPage,
        transformedCommand,
      }
    } catch (error) {
      console.error('Command processing failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * 批量处理命令
   */
  async processBatch(
    page: PageSchema,
    commands: EditorCommand[],
    options?: any,
  ): Promise<PageSchema> {
    let currentPage = page

    for (const command of commands) {
      const result = await this.process(currentPage, command, {
        ...options,
        immediate: false, // 批量处理时不立即应用
      })

      if (result.success && result.newPage) {
        currentPage = result.newPage
      } else {
        throw new Error(`Batch processing failed: ${result.error}`)
      }
    }

    // 批量处理完成后一次性记录
    if (options?.trackHistory) {
      this.addToHistory(commands)
    }

    return currentPage
  }

  /**
   * 获取未同步的命令
   */
  getPendingCommands(): EditorCommand[] {
    return [...this.pendingCommands]
  }

  /**
   * 清空待处理命令
   */
  clearPending(commands?: EditorCommand[]): void {
    if (commands) {
      this.pendingCommands = this.pendingCommands.filter(
        (cmd) => !commands.some((c) => c.id === cmd.id),
      )
    } else {
      this.pendingCommands = []
    }
  }

  // ==================== 私有方法 ====================

  private validateCommand(command: EditorCommand, page: PageSchema): boolean {
    // 基础验证
    if (!command.id || !command.type || !command.timestamp) {
      return false
    }

    // 根据命令类型进行特定验证
    switch (command.type) {
      case 'COMPONENT_CREATE':
        const createPayload = command.payload as any
        return !page.components[createPayload.componentId]

      case 'COMPONENT_DELETE':
        const deletePayload = command.payload as any
        return !!page.components[deletePayload.componentId]

      case 'COMPONENT_MOVE':
        const movePayload = command.payload as any
        return !TreeManager.willCauseCycle(page, movePayload.componentId, movePayload.toParentId)

      default:
        return true
    }
  }

  private assignSequence(command: EditorCommand): EditorCommand {
    return {
      ...command,
      sequence: this.sequenceNumber++,
    }
  }

  private applyTransformation(command: EditorCommand): EditorCommand {
    // 检查与未处理命令的冲突
    for (let i = 0; i < this.pendingCommands.length; i++) {
      const pending = this.pendingCommands[i]
      if (OperationTransformer.areConflicting(command, pending)) {
        const [transformedPending, transformedNew] = OperationTransformer.transform(
          pending,
          command,
        )

        // 更新待处理命令
        this.pendingCommands[i] = transformedPending
        return transformedNew
      }
    }

    return command
  }

  private async syncToServer(command: EditorCommand): Promise<void> {
    // 实际实现会调用infra层
    // 这里先模拟
    console.log('Syncing command to server:', command)

    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 50))
  }

  private addToHistory(commands: EditorCommand | EditorCommand[]): void {
    // 实际实现会保存到历史记录
    const cmds = Array.isArray(commands) ? commands : [commands]
    console.log(
      'Adding to history:',
      cmds.map((c) => ({ id: c.id, type: c.type })),
    )
  }
}
