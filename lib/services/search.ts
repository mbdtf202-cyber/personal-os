import { prisma } from '@/lib/prisma'

export class SearchService {
  async globalSearch(userId: string, query: string, filters?: {
    type?: string[]
  }) {
    const searchTerm = `%${query}%`
    
    const results = await Promise.all([
      // Search blog posts
      (!filters?.type || filters.type.includes('blog')) ? prisma.post.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: query } },
            { contentMarkdown: { contains: query } },
          ],
        },
        take: 10,
        select: {
          id: true,
          title: true,
          contentMarkdown: true,
          status: true,
          createdAt: true,
        },
      }) : [],
      
      // Search news items
      (!filters?.type || filters.type.includes('news')) ? prisma.newsItem.findMany({
        where: {
          source: { userId },
          OR: [
            { title: { contains: query } },
            { summary: { contains: query } },
          ],
        },
        take: 10,
        select: {
          id: true,
          title: true,
          summary: true,
          url: true,
          publishedAt: true,
          source: {
            select: {
              name: true,
            },
          },
        },
      }) : [],
      
      // Search bookmarks
      (!filters?.type || filters.type.includes('bookmarks')) ? prisma.bookmark.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
        },
        take: 10,
        select: {
          id: true,
          title: true,
          description: true,
          url: true,
          category: true,
          createdAt: true,
        },
      }) : [],
      
      // Search projects
      (!filters?.type || filters.type.includes('projects')) ? prisma.project.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
        },
        take: 10,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          createdAt: true,
        },
      }) : [],
    ])

    return {
      blog: results[0].map(item => ({ ...item, type: 'blog' })),
      news: results[1].map(item => ({ ...item, type: 'news' })),
      bookmarks: results[2].map(item => ({ ...item, type: 'bookmark' })),
      projects: results[3].map(item => ({ ...item, type: 'project' })),
      total: results[0].length + results[1].length + results[2].length + results[3].length,
    }
  }
}

export const searchService = new SearchService()
