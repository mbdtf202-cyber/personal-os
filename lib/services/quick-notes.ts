import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay } from 'date-fns'

export class QuickNotesService {
  async getNotes(userId: string) {
    return prisma.quickNote.findMany({
      where: { userId },
      orderBy: [
        { isPinned: 'desc' },
        { updatedAt: 'desc' },
      ],
    })
  }

  async getLatest(userId: string) {
    return prisma.quickNote.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    })
  }

  async getTodayCount(userId: string) {
    const now = new Date()
    return prisma.quickNote.count({
      where: {
        userId,
        createdAt: {
          gte: startOfDay(now),
          lte: endOfDay(now),
        },
      },
    })
  }

  async getOverview(userId: string) {
    const [todayCount, latest] = await Promise.all([
      this.getTodayCount(userId),
      this.getLatest(userId),
    ])

    return { todayCount, latest }
  }
}

export const quickNotesService = new QuickNotesService()
