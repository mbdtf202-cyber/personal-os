// 速率限制
interface RateLimitConfig {
  windowMs: number // 时间窗口（毫秒）
  maxRequests: number // 最大请求数
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private config: RateLimitConfig

  constructor(config: RateLimitConfig = { windowMs: 60000, maxRequests: 100 }) {
    this.config = config
  }

  isAllowed(key: string): boolean {
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    if (!this.requests.has(key)) {
      this.requests.set(key, [now])
      return true
    }

    const timestamps = this.requests.get(key)!
    const recentRequests = timestamps.filter((ts) => ts > windowStart)

    if (recentRequests.length < this.config.maxRequests) {
      recentRequests.push(now)
      this.requests.set(key, recentRequests)
      return true
    }

    return false
  }

  getRemainingRequests(key: string): number {
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    if (!this.requests.has(key)) {
      return this.config.maxRequests
    }

    const timestamps = this.requests.get(key)!
    const recentRequests = timestamps.filter((ts) => ts > windowStart)

    return Math.max(0, this.config.maxRequests - recentRequests.length)
  }

  reset(key?: string) {
    if (key) {
      this.requests.delete(key)
    } else {
      this.requests.clear()
    }
  }
}

export const createRateLimiter = (config?: RateLimitConfig) => new RateLimiter(config)

// 默认限制器
export const defaultRateLimiter = createRateLimiter({
  windowMs: 60000, // 1分钟
  maxRequests: 100,
})
