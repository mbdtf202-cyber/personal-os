import { prisma } from '@/lib/prisma'

export class NewsService {
  async getNewsSources(userId: string) {
    return prisma.newsSource.findMany({
      where: { userId },
      include: {
        items: {
          take: 5,
          orderBy: { publishedAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getNewsItems(userId: string, filters?: {
    type?: string
    isRead?: boolean
  }) {
    return prisma.newsItem.findMany({
      where: {
        source: { userId },
        ...(filters?.type && { source: { type: filters.type } }),
        ...(filters?.isRead !== undefined && { isRead: filters.isRead }),
      },
      include: {
        source: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 50,
    })
  }

  async createNewsSource(userId: string, data: {
    name: string
    type: string
    url: string
    fetchStrategy: string
  }) {
    return prisma.newsSource.create({
      data: {
        ...data,
        userId,
      },
    })
  }

  async updateNewsItem(id: string, data: {
    isRead?: boolean
    isFavorited?: boolean
  }) {
    return prisma.newsItem.update({
      where: { id },
      data,
    })
  }

  async getUnreadCount(userId: string) {
    return prisma.newsItem.count({
      where: {
        source: { userId },
        isRead: false,
      },
    })
  }
}

export const newsService = new NewsService()
