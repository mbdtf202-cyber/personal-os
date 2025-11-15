// 智能数据预加载
export class DataPrefetcher {
  private static instance: DataPrefetcher
  private prefetchQueue: Map<string, Promise<any>> = new Map()
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5分钟

  private constructor() {}

  static getInstance(): DataPrefetcher {
    if (!DataPrefetcher.instance) {
      DataPrefetcher.instance = new DataPrefetcher()
    }
    return DataPrefetcher.instance
  }

  async prefetch(url: string, options?: RequestInit): Promise<void> {
    if (this.prefetchQueue.has(url)) return
    if (this.isCacheValid(url)) return

    const promise = fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        this.cache.set(url, { data, timestamp: Date.now() })
        this.prefetchQueue.delete(url)
        return data
      })
      .catch((error) => {
        console.error(`Prefetch failed for ${url}:`, error)
        this.prefetchQueue.delete(url)
      })

    this.prefetchQueue.set(url, promise)
  }

  async get(url: string): Promise<any | null> {
    const cached = this.cache.get(url)
    if (cached && this.isCacheValid(url)) {
      return cached.data
    }

    const pending = this.prefetchQueue.get(url)
    if (pending) {
      return await pending
    }

    return null
  }

  private isCacheValid(url: string): boolean {
    const cached = this.cache.get(url)
    if (!cached) return false
    return Date.now() - cached.timestamp < this.CACHE_TTL
  }

  clear(): void {
    this.cache.clear()
    this.prefetchQueue.clear()
  }

  // 预加载常用路由数据
  prefetchCommonRoutes(userId: string): void {
    const routes = [
      `/api/analytics`,
      `/api/health/logs?limit=7`,
      `/api/bookmarks?status=TO_READ`,
      `/api/projects?status=IN_PROGRESS`,
      `/api/training/stats`,
    ]

    routes.forEach((route) => this.prefetch(route))
  }
}

export const prefetcher = DataPrefetcher.getInstance()

// React Hook
export function usePrefetch() {
  return {
    prefetch: (url: string, options?: RequestInit) => prefetcher.prefetch(url, options),
    get: (url: string) => prefetcher.get(url),
    clear: () => prefetcher.clear(),
  }
}
