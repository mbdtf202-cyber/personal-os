// 数据导出和备份服务
import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/cache'

export interface ExportOptions {
  format: 'json' | 'csv' | 'markdown'
  modules?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
}

export class DataExportService {
  // 导出所有数据
  async exportAllData(userId: string, options: ExportOptions = { format: 'json' }) {
    const cacheKey = `export:${userId}:${JSON.stringify(options)}`
    const cached = cache.get<any>(cacheKey)
    if (cached) return cached

    const data: any = {
      exportDate: new Date().toISOString(),
      userId,
      modules: {},
    }

    const modules = options.modules || [
      'health',
      'blog',
      'news',
      'social',
      'trading',
      'projects',
      'bookmarks',
      'training',
    ]

    // 导出健康数据
    if (modules.includes('health')) {
      data.modules.health = await this.exportHealthData(userId, options.dateRange)
    }

    // 导出博客数据
    if (modules.includes('blog')) {
      data.modules.blog = await this.exportBlogData(userId, options.dateRange)
    }

    // 导出新闻数据
    if (modules.includes('news')) {
      data.modules.news = await this.exportNewsData(userId, options.dateRange)
    }

    // 导出社交数据
    if (modules.includes('social')) {
      data.modules.social = await this.exportSocialData(userId, options.dateRange)
    }

    // 导出交易数据
    if (modules.includes('trading')) {
      data.modules.trading = await this.exportTradingData(userId, options.dateRange)
    }

    // 导出项目数据
    if (modules.includes('projects')) {
      data.modules.projects = await this.exportProjectsData(userId)
    }

    // 导出书签数据
    if (modules.includes('bookmarks')) {
      data.modules.bookmarks = await this.exportBookmarksData(userId)
    }

    // 导出培训数据
    if (modules.includes('training')) {
      data.modules.training = await this.exportTrainingData(userId, options.dateRange)
    }

    cache.set(cacheKey, data, 300) // 缓存5分钟
    return data
  }

  private async exportHealthData(userId: string, dateRange?: { start: Date; end: Date }) {
    const where: any = { userId }
    if (dateRange) {
      where.date = {
        gte: dateRange.start,
        lte: dateRange.end,
      }
    }

    const [logs, habits] = await Promise.all([
      prisma.healthDailyLog.findMany({ where, orderBy: { date: 'desc' } }),
      prisma.habit.findMany({
        where: { userId },
        include: { checkins: true },
      }),
    ])

    return { logs, habits }
  }

  private async exportBlogData(userId: string, dateRange?: { start: Date; end: Date }) {
    const where: any = { userId }
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.start,
        lte: dateRange.end,
      }
    }

    return await prisma.post.findMany({
      where,
      include: { tags: true, links: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  private async exportNewsData(userId: string, dateRange?: { start: Date; end: Date }) {
    const sources = await prisma.newsSource.findMany({
      where: { userId },
      include: {
        items: dateRange
          ? {
              where: {
                publishedAt: {
                  gte: dateRange.start,
                  lte: dateRange.end,
                },
              },
            }
          : true,
      },
    })

    return sources
  }

  private async exportSocialData(userId: string, dateRange?: { start: Date; end: Date }) {
    const where: any = { userId }
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.start,
        lte: dateRange.end,
      }
    }

    return await prisma.socialPost.findMany({
      where,
      include: { tags: true, stats: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  private async exportTradingData(userId: string, dateRange?: { start: Date; end: Date }) {
    const where: any = { userId }
    if (dateRange) {
      where.date = {
        gte: dateRange.start,
        lte: dateRange.end,
      }
    }

    const [trades, summaries] = await Promise.all([
      prisma.trade.findMany({
        where,
        include: { tags: true },
        orderBy: { date: 'desc' },
      }),
      prisma.tradingDailySummary.findMany({
        where,
        orderBy: { date: 'desc' },
      }),
    ])

    return { trades, summaries }
  }

  private async exportProjectsData(userId: string) {
    return await prisma.project.findMany({
      where: { userId },
      include: { tags: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  private async exportBookmarksData(userId: string) {
    return await prisma.bookmark.findMany({
      where: { userId },
      include: { tags: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  private async exportTrainingData(userId: string, dateRange?: { start: Date; end: Date }) {
    const where: any = { userId }
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.start,
        lte: dateRange.end,
      }
    }

    const [notes, snippets, resources, bugs, progress] = await Promise.all([
      prisma.trainingNote.findMany({ where, orderBy: { createdAt: 'desc' } }),
      prisma.trainingSnippet.findMany({ where, orderBy: { createdAt: 'desc' } }),
      prisma.trainingResource.findMany({ where, orderBy: { createdAt: 'desc' } }),
      prisma.trainingBug.findMany({ where, orderBy: { createdAt: 'desc' } }),
      prisma.trainingProgress.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } }),
    ])

    return { notes, snippets, resources, bugs, progress }
  }

  // 格式化为 CSV
  toCSV(data: any[]): string {
    if (data.length === 0) return ''

    const headers = Object.keys(data[0])
    const rows = data.map((item) =>
      headers.map((header) => {
        const value = item[header]
        if (value === null || value === undefined) return ''
        if (typeof value === 'object') return JSON.stringify(value)
        return String(value).replace(/"/g, '""')
      })
    )

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    return csvContent
  }

  // 格式化为 Markdown
  toMarkdown(data: any, title: string): string {
    let md = `# ${title}\n\n`
    md += `导出时间: ${new Date().toLocaleString('zh-CN')}\n\n`

    for (const [module, moduleData] of Object.entries(data.modules)) {
      md += `## ${module}\n\n`
      if (Array.isArray(moduleData)) {
        md += `共 ${moduleData.length} 条记录\n\n`
      } else if (typeof moduleData === 'object') {
        for (const [key, value] of Object.entries(moduleData)) {
          if (Array.isArray(value)) {
            md += `### ${key}\n\n`
            md += `共 ${value.length} 条记录\n\n`
          }
        }
      }
    }

    return md
  }
}

export const dataExportService = new DataExportService()
