// 组件实例池，避免重复创建销毁

export class ComponentPool {
  private pool = new Map<string, any>()
  private maxSize: number

  constructor(maxSize = 100) {
    this.maxSize = maxSize
  }

  getComInstance(key: string): any | undefined {
    return this.pool.get(key)
  }

  setComInstanceMap(key: string, component: any) {
    // LRU 淘汰策略
    if (this.pool.size >= this.maxSize) {
      const firstKey = this.pool.keys().next().value
      this.pool.delete(firstKey!)
    }
    this.pool.set(key, component)
  }

  delete(key: string) {
    this.pool.delete(key)
  }

  clear() {
    this.pool.clear()
  }

  getSize() {
    return this.pool.size
  }
}
