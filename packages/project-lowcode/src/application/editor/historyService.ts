//历史记录，撤销重做
// application/editor/history.service.ts
import type { EditorCommand } from 'public-shared'
import { commandToOperationLog, OperationLog } from 'public-shared'
export class HistoryService {
  private operations: OperationLog[] = []
  private maxHistory = 1000

  push(command: EditorCommand): void {
    const operation = commandToOperationLog(command, this.getCurrentUserId(), this.getSessionId())

    this.operations.push(operation)

    // 限制历史记录大小
    if (this.operations.length > this.maxHistory) {
      this.operations.shift()
    }
  }
  getCurrentUserId(): string {
    return 'current-user-id'
  }
  getSessionId(): string {
    return 'current-session-id'
  }

  getUnsyncedOperations(): OperationLog[] {
    return this.operations.filter((op) => !op.synced)
  }

  markAsSynced(operationId?: string): void {
    if (operationId) {
      const op = this.operations.find((o) => o.id === operationId)
      if (op) op.synced = true
    } else {
      this.operations.forEach((op) => (op.synced = true))
    }
  }

  // 用于撤销/重做
  getOperationsAfter(timestamp: number): OperationLog[] {
    return this.operations.filter((op) => op.timestamp > timestamp)
  }
}
