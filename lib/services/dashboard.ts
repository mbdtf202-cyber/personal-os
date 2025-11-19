import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay } from 'date-fns'
import { quickNotesService } from '@/lib/services/quick-notes'

export class DashboardService {
  async getTodayOverview(userId: string) {
    const today = new Date()
    const startDate = startOfDay(today)
    const endDate = endOfDay(today)

    const [
      todayHealthLog,
      pendingHabits,
      draftPosts,
      unreadNews,
      scheduledSocialPosts,
      activeTrades,
      activeProjects,
      toReadBookmarks,
      quickNotes,
    ] = await Promise.all([
      prisma.healthDailyLog.findFirst({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      prisma.habit.findMany({
        where: {
          userId,
        },
        include: {
          checkins: {
            where: {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        },
      }),
      prisma.post.count({
        where: {
          userId,
          status: 'DRAFT',
        },
      }),
      prisma.newsItem.count({
        where: {
          source: { userId },
          isRead: false,
        },
      }),
      prisma.socialPost.findMany({
        where: {
          userId,
          status: 'SCHEDULED',
          plannedPublishTime: {
            gte: startDate,
            lte: endDate,
          },
        },
        take: 5,
      }),
      prisma.trade.count({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      prisma.project.count({
        where: {
          userId,
          status: 'IN_PROGRESS',
        },
      }),
      prisma.bookmark.count({
        where: {
          userId,
          status: 'TO_READ',
        },
      }),
      quickNotesService.getOverview(userId),
    ])

    const pendingHabitsCount = pendingHabits.filter(h => h.checkins.length === 0).length

    return {
      health: {
        hasLog: !!todayHealthLog,
        pendingHabits: pendingHabitsCount,
      },
      blog: {
        draftCount: draftPosts,
      },
      news: {
        unreadCount: unreadNews,
      },
      social: {
        scheduledToday: scheduledSocialPosts.length,
        posts: scheduledSocialPosts,
      },
      trading: {
        tradesCount: activeTrades,
      },
      projects: {
        activeCount: activeProjects,
      },
      bookmarks: {
        toReadCount: toReadBookmarks,
      },
      quickNotes,
    }
  }

  async getRecentActivity(userId: string, limit: number = 10) {
    const [recentPosts, rawTrades, recentProjects] = await Promise.all([
      prisma.post.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        select: {
          id: true,
          title: true,
          status: true,
          updatedAt: true,
        },
      }),
      prisma.trade.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: limit,
        select: {
          id: true,
          symbol: true,
          pnl: true,
          date: true,
        },
      }),
      prisma.project.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        select: {
          id: true,
          title: true,
          status: true,
          updatedAt: true,
        },
      }),
    ])

    const recentTrades = rawTrades.map(t => ({
      ...t,
      pnl: t.pnl.toNumber()
    }))

    return {
      posts: recentPosts,
      trades: recentTrades,
      projects: recentProjects,
    }
  }
}

export const dashboardService = new DashboardService()
