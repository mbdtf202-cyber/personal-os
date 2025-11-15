// 数据库查询优化工具
import { Prisma } from '@prisma/client'

// 批量查询优化
export class BatchLoader<T> {
  private queue: Array<{
    key: string
    resolve: (value: T | null) => void
  }> = []
  private timeout: NodeJS.Timeout | null = null
  private loader: (keys: string[]) => Promise<Map<string, T>>

  constructor(
    loader: (keys: string[]) => Promise<Map<string, T>>,
    private batchDelay: number = 10
  ) {
    this.loader = loader
  }

  load(key: string): Promise<T | null> {
    return new Promise((resolve) => {
      this.queue.push({ key, resolve })

      if (!this.timeout) {
        this.timeout = setTimeout(() => this.flush(), this.batchDelay)
      }
    })
  }

  private async flush(): void {
    const queue = this.queue
    this.queue = []
    this.timeout = null

    if (queue.length === 0) return

    const keys = queue.map((item) => item.key)
    const uniqueKeys = Array.from(new Set(keys))

    try {
      const results = await this.loader(uniqueKeys)

      queue.forEach(({ key, resolve }) => {
        resolve(results.get(key) || null)
      })
    } catch (error) {
      queue.forEach(({ resolve }) => resolve(null))
    }
  }
}

// 分页优化
export interface PaginationOptions {
  page?: number
  pageSize?: number
  cursor?: string
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export async function paginate<T>(
  query: {
    findMany: (args: any) => Promise<T[]>
    count: (args: any) => Promise<number>
  },
  where: any,
  options: PaginationOptions = {}
): Promise<PaginatedResult<T>> {
  const page = Math.max(1, options.page || 1)
  const pageSize = Math.min(100, Math.max(1, options.pageSize || 20))
  const skip = (page - 1) * pageSize

  const [data, total] = await Promise.all([
    query.findMany({
      where,
      skip,
      take: pageSize,
    }),
    query.count({ where }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return {
    data,
    pagination: {
      total,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

// 查询性能监控
export function measureQuery<T>(
  queryName: string,
  query: () => Promise<T>
): Promise<T> {
  const start = performance.now()
  
  return query().then(
    (result) => {
      const duration = performance.now() - start
      if (duration > 1000) {
        console.warn(`Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`)
      }
      return result
    },
    (error) => {
      const duration = performance.now() - start
      console.error(`Query failed: ${queryName} after ${duration.toFixed(2)}ms`, error)
      throw error
    }
  )
}
