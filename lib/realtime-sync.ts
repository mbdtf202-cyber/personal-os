// 实时数据同步系统
type SyncCallback = (data: any) => void

class RealtimeSync {
  private static instance: RealtimeSync
  private subscribers: Map<string, Set<SyncCallback>> = new Map()
  private syncInterval: NodeJS.Timeout | null = null
  private lastSync: Map<string, number> = new Map()

  private constructor() {
    this.startSync()
  }

  static getInstance(): RealtimeSync {
    if (!RealtimeSync.instance) {
      RealtimeSync.instance = new RealtimeSync()
    }
    return RealtimeSync.instance
  }

  // 订阅数据更新
  subscribe(channel: string, callback: SyncCallback): () => void {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set())
    }
    this.subscribers.get(channel)!.add(callback)

    // 返回取消订阅函数
    return () => {
      const callbacks = this.subscribers.get(channel)
      if (callbacks) {
        callbacks.delete(callback)
        if (callbacks.size === 0) {
          this.subscribers.delete(channel)
        }
      }
    }
  }

  // 发布数据更新
  publish(channel: string, data: any): void {
    const callbacks = this.subscribers.get(channel)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in sync callback for ${channel}:`, error)
        }
      })
    }
  }

  // 启动同步
  private startSync(): void {
    if (this.syncInterval) return

    // 每30秒检查一次更新
    this.syncInterval = setInterval(() => {
      this.checkUpdates()
    }, 30000)
  }

  // 检查更新
  private async checkUpdates(): Promise<void> {
    const channels = Array.from(this.subscribers.keys())
    
    for (const channel of channels) {
      try {
        const lastSyncTime = this.lastSync.get(channel) || 0
        const response = await fetch(`/api/sync/${channel}?since=${lastSyncTime}`)
        
        if (response.ok) {
          const data = await response.json()
          if (data.updates && data.updates.length > 0) {
            this.publish(channel, data.updates)
            this.lastSync.set(channel, Date.now())
          }
        }
      } catch (error) {
        console.error(`Failed to sync ${channel}:`, error)
      }
    }
  }

  // 手动触发同步
  async sync(channel: string): Promise<void> {
    try {
      const response = await fetch(`/api/sync/${channel}`)
      if (response.ok) {
        const data = await response.json()
        this.publish(channel, data)
        this.lastSync.set(channel, Date.now())
      }
    } catch (error) {
      console.error(`Failed to sync ${channel}:`, error)
    }
  }

  // 停止同步
  stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  // 清除所有订阅
  clear(): void {
    this.subscribers.clear()
    this.lastSync.clear()
    this.stopSync()
  }
}

export const realtimeSync = RealtimeSync.getInstance()

// React Hook
export function useRealtimeSync(channel: string, callback: SyncCallback) {
  if (typeof window === 'undefined') return

  const sync = RealtimeSync.getInstance()
  
  // 订阅
  const unsubscribe = sync.subscribe(channel, callback)
  
  // 清理
  return () => {
    unsubscribe()
  }
}
