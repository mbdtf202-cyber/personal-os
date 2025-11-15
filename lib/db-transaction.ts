// 数据库事务处理
import { prisma } from './prisma'

export async function withTransaction<T>(
  callback: (tx: typeof prisma) => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    return callback(tx)
  })
}

// 批量操作优化
export async function batchCreate<T>(
  model: any,
  data: any[],
  batchSize: number = 100
): Promise<T[]> {
  const results: T[] = []

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map((item) => model.create({ data: item }))
    )
    results.push(...batchResults)
  }

  return results
}

// 批量更新
export async function batchUpdate<T>(
  model: any,
  updates: Array<{ id: string; data: any }>,
  batchSize: number = 100
): Promise<T[]> {
  const results: T[] = []

  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(({ id, data }) =>
        model.update({
          where: { id },
          data,
        })
      )
    )
    results.push(...batchResults)
  }

  return results
}

// 批量删除
export async function batchDelete(
  model: any,
  ids: string[],
  batchSize: number = 100
): Promise<number> {
  let deleted = 0

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize)
    const result = await model.deleteMany({
      where: { id: { in: batch } },
    })
    deleted += result.count
  }

  return deleted
}
