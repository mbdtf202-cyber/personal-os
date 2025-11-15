// 性能监控工具
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // 记录性能指标
  record(name: string, duration: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    const metrics = this.metrics.get(name)!
    metrics.push(duration)
    
    // 只保留最近100条记录
    if (metrics.length > 100) {
      metrics.shift()
    }
  }

  // 获取平均值
  getAverage(name: string): number {
    const metrics = this.metrics.get(name)
    if (!metrics || metrics.length === 0) return 0
    return metrics.reduce((a, b) => a + b, 0) / metrics.length
  }

  // 获取P95值
  getP95(name: string): number {
    const metrics = this.metrics.get(name)
    if (!metrics || metrics.length === 0) return 0
    const sorted = [...metrics].sort((a, b) => a - b)
    const index = Math.floor(sorted.length * 0.95)
    return sorted[index]
  }

  // 获取所有指标
  getAllMetrics(): Record<string, { avg: number; p95: number; count: number }> {
    const result: Record<string, { avg: number; p95: number; count: number }> = {}
    for (const [name, metrics] of this.metrics.entries()) {
      result[name] = {
        avg: this.getAverage(name),
        p95: this.getP95(name),
        count: metrics.length,
      }
    }
    return result
  }

  // 清除指标
  clear(name?: string): void {
    if (name) {
      this.metrics.delete(name)
    } else {
      this.metrics.clear()
    }
  }
}

// 性能测量装饰器
export function measure(metricName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const start = performance.now()
      try {
        const result = await originalMethod.apply(this, args)
        const duration = performance.now() - start
        PerformanceMonitor.getInstance().record(metricName, duration)
        return result
      } catch (error) {
        const duration = performance.now() - start
        PerformanceMonitor.getInstance().record(`${metricName}_error`, duration)
        throw error
      }
    }

    return descriptor
  }
}

// 简单的性能测量函数
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now()
  try {
    const result = await fn()
    const duration = performance.now() - start
    PerformanceMonitor.getInstance().record(name, duration)
    return result
  } catch (error) {
    const duration = performance.now() - start
    PerformanceMonitor.getInstance().record(`${name}_error`, duration)
    throw error
  }
}

// Web Vitals 监控
export function reportWebVitals(metric: any) {
  const { name, value, id } = metric
  
  // 发送到分析服务
  if (typeof window !== 'undefined') {
    console.log(`[Web Vitals] ${name}:`, value)
    
    // 可以发送到分析服务
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   body: JSON.stringify({ name, value, id }),
    // })
  }
}
