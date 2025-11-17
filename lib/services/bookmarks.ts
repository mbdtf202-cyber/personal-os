import { prisma } from '@/lib/prisma'
import { UnauthorizedError } from '@/lib/auth'

export class BookmarksService {
  async getBookmarks(userId: string, filters?: {
    category?: string
    status?: string
    type?: string
  }) {
    return prisma.bookmark.findMany({
      where: {
        userId,
        ...(filters?.category && { category: filters.category }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.type && { type: filters.type }),
      },
      include: {
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async createBookmark(userId: string, data: {
    title: string
    url: string
    description?: string
    siteName?: string
    domain?: string
    faviconUrl?: string
    imageUrl?: string
    type?: string
    category: string
    status?: string
  }) {
    return prisma.bookmark.create({
      data: {
        ...data,
        userId,
        type: data.type || 'other',
        status: data.status || 'TO_READ',
      },
    })
  }

  async recordVisit(id: string, userId: string) {
    const bookmark = await prisma.bookmark.findFirst({
      where: { id, userId },
    })

    if (!bookmark) {
      throw new UnauthorizedError('Bookmark not found or access denied')
    }

    return prisma.bookmark.update({
      where: { id },
      data: {
        lastVisitedAt: new Date(),
        visitCount: { increment: 1 },
      },
    })
  }
}

export const bookmarksService = new BookmarksService()
export const bookmarkService = bookmarksService
