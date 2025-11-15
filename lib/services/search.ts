// 全局搜索服务
import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/cache'

export class SearchService {
  async search(userId: string, query: string) {
    if (!query || query.length < 2) {
      return { total: 0, blog: [], news: [], bookmarks: [], projects: [], training: [] }
    }

    const cacheKey = `search:${userId}:${query}`
    const cached = cache.get<any>(cacheKey)
    if (cached) return cached

    const searchTerm = `%${query.toLowerCase()}%`

    const [blog, news, bookmarks, projects, training] = await Promise.all([
      this.searchBlog(userId, searchTerm),
      this.searchNews(userId, searchTerm),
      this.searchBookmarks(userId, searchTerm),
      this.searchProjects(userId, searchTerm),
      this.searchTraining(userId, searchTerm),
    ])

    const results = {
      total: blog.length + news.length + bookmarks.length + projects.length + training.length,
      blog,
      news,
      bookmarks,
      projects,
      training,
    }

    cache.set(cacheKey, results, 60)
    return results
  }

  private async searchBlog(userId: string, searchTerm: string) {
    return await prisma.post.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { contentMarkdown: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: 10,
      orderBy: { updatedAt: 'desc' },
    })
  }

  private async searchNews(userId: string, searchTerm: string) {
    const sources = await prisma.newsSource.findMany({
      where: { userId },
      select: { id: true },
    })

    const sourceIds = sources.map(s => s.id)

    return await prisma.newsItem.findMany({
      where: {
        sourceId: { in: sourceIds },
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { summary: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: { source: true },
      take: 10,
      orderBy: { publishedAt: 'desc' },
    })
  }

  private async searchBookmarks(userId: string, searchTerm: string) {
    return await prisma.bookmark.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { url: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
    })
  }

  private async searchProjects(userId: string, searchTerm: string) {
    return await prisma.project.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { techStack: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: 10,
      orderBy: { updatedAt: 'desc' },
    })
  }

  private async searchTraining(userId: string, searchTerm: string) {
    const notes = await prisma.trainingNote.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { contentMd: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: 5,
      orderBy: { updatedAt: 'desc' },
    })

    return notes
  }
}

export const searchService = new SearchService()
