// application/editor/persistence.service.ts
/**import type { EditorCommand, PageSchema } from '@/domain/schema/index'
export class PersistenceService {
  constructor(
    private editorApi: EditorApi,
    private historyService: HistoryService,
  ) {}

  // 自动保存（防抖）
  private autoSaveTimer: NodeJS.Timeout | null = null

  scheduleAutoSave(page: PageSchema): void {
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer)
    }

    this.autoSaveTimer = setTimeout(() => {
      this.save(page).catch(console.error)
    }, 10000) // 10秒后自动保存
  }

  // 手动保存
  async save(page: PageSchema): Promise<boolean> {
    try {
      // 获取未同步的操作记录
      const unsyncedOperations = this.historyService.getUnsyncedOperations()

      // 发送到后端
      await this.editorApi.saveEditorState(page, unsyncedOperations)

      // 标记为已同步
      this.historyService.markAsSynced()

      console.log('✅ 保存成功')
      return true
    } catch (error) {
      console.error('❌ 保存失败:', error)
      // 可以在这里实现重试逻辑
      return false
    }
  }

  // 记录操作（为未来实时同步准备）
  recordOperation(command: EditorCommand): void {
    this.historyService.push(command)

    // 如果是关键操作，立即同步（可选）
    if (this.shouldSyncImmediately(command)) {
      this.syncOperationImmediately(command)
    }
  }

  private shouldSyncImmediately(command: EditorCommand): boolean {
    // 定义需要实时同步的操作类型
    const immediateOps = ['DELETE_COMPONENT', 'MOVE_COMPONENT', 'ADD_COMPONENT']
    return immediateOps.includes(command.type)
  }

  private async syncOperationImmediately(command: EditorCommand): Promise<void> {
    try {
      await this.editorApi.syncOperation(command)
      this.historyService.markAsSynced(command.id)
    } catch (error) {
      console.warn('实时同步失败，将稍后重试:', error)
    }
  }
}
*/
