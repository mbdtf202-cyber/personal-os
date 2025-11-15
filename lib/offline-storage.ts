// 离线存储管理
interface StorageItem<T> {
  data: T
  timestamp: number
  version: number
}

class OfflineStorage {
  private static instance: OfflineStorage
  private dbName = 'personal-os-offline'
  private version = 1
  private db: IDBDatabase | null = null

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initDB()
    }
  }

  static getInstance(): OfflineStorage {
    if (!OfflineStorage.instance) {
      OfflineStorage.instance = new OfflineStorage()
    }
    return OfflineStorage.instance
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // 创建对象存储
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' })
        }
        if (!db.objectStoreNames.contains('queue')) {
          db.createObjectStore('queue', { keyPath: 'id', autoIncrement: true })
        }
      }
    })
  }

  // 保存数据到缓存
  async set<T>(key: string, data: T): Promise<void> {
    if (!this.db) await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      
      const item: StorageItem<T> & { key: string } = {
        key,
        data,
        timestamp: Date.now(),
        version: this.version,
      }

      const request = store.put(item)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // 从缓存获取数据
  async get<T>(key: string): Promise<T | null> {
    if (!this.db) await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readonly')
      const store = transaction.objectStore('cache')
      const request = store.get(key)

      request.onsuccess = () => {
        const item = request.result as (StorageItem<T> & { key: string }) | undefined
        if (item) {
          // 检查数据是否过期（24小时）
          const isExpired = Date.now() - item.timestamp > 24 * 60 * 60 * 1000
          if (!isExpired) {
            resolve(item.data)
            return
          }
        }
        resolve(null)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // 删除缓存
  async delete(key: string): Promise<void> {
    if (!this.db) await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const request = store.delete(key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // 清除所有缓存
  async clear(): Promise<void> {
    if (!this.db) await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // 添加到离线队列
  async addToQueue(action: string, data: any): Promise<void> {
    if (!this.db) await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['queue'], 'readwrite')
      const store = transaction.objectStore('queue')
      
      const item = {
        action,
        data,
        timestamp: Date.now(),
      }

      const request = store.add(item)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // 获取离线队列
  async getQueue(): Promise<any[]> {
    if (!this.db) await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['queue'], 'readonly')
      const store = transaction.objectStore('queue')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // 清空队列
  async clearQueue(): Promise<void> {
    if (!this.db) await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['queue'], 'readwrite')
      const store = transaction.objectStore('queue')
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

export const offlineStorage = OfflineStorage.getInstance()

// 网络状态监听
export class NetworkMonitor {
  private static instance: NetworkMonitor
  private listeners: Set<(online: boolean) => void> = new Set()
  private _isOnline: boolean = true

  private constructor() {
    if (typeof window !== 'undefined') {
      this._isOnline = navigator.onLine
      window.addEventListener('online', () => this.handleOnline())
      window.addEventListener('offline', () => this.handleOffline())
    }
  }

  static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor()
    }
    return NetworkMonitor.instance
  }

  get isOnline(): boolean {
    return this._isOnline
  }

  private handleOnline(): void {
    this._isOnline = true
    this.notify(true)
    this.syncOfflineQueue()
  }

  private handleOffline(): void {
    this._isOnline = false
    this.notify(false)
  }

  private notify(online: boolean): void {
    this.listeners.forEach(listener => {
      try {
        listener(online)
      } catch (error) {
        console.error('Error in network listener:', error)
      }
    })
  }

  subscribe(listener: (online: boolean) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private async syncOfflineQueue(): Promise<void> {
    try {
      const queue = await offlineStorage.getQueue()
      for (const item of queue) {
        try {
          await fetch('/api/sync/queue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
          })
        } catch (error) {
          console.error('Failed to sync queue item:', error)
        }
      }
      await offlineStorage.clearQueue()
    } catch (error) {
      console.error('Failed to sync offline queue:', error)
    }
  }
}

export const networkMonitor = NetworkMonitor.getInstance()
