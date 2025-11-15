// 数据分析服务
import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/cache'
import { measureAsync } from '@/lib/performance'

export class AnalyticsService {
  // 获取用户活动统计
  async getUserActivityStats(userId: string, days: number = 30) {
    const cacheKey = `analytics:activity:${userId}:${days}`
    const cached = cache.get<any>(cacheKey)
    if (cached) return cached

    const result = await measureAsync('analytics:getUserActivityStats', async () => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const [healthLogs, posts, trades, trainingNotes] = await Promise.all([
        prisma.healthDailyLog.count({
          where: { userId, date: { gte: startDate } },
        }),
        prisma.post.count({
          where: { userId, createdAt: { gte: startDate } },
        }),
        prisma.trade.count({
          where: { userId, date: { gte: startDate } },
        }),
        prisma.trainingNote.count({
          where: { userId, createdAt: { gte: startDate } },
        }),
      ])

      return {
        totalActivities: healthLogs + posts + trades + trainingNotes,
        breakdown: {
          health: healthLogs,
          blog: posts,
          trading: trades,
          training: trainingNotes,
        },
      }
    })

    cache.set(cacheKey, result, 300)
    return result
  }

  // 获取生产力分数
  async getProductivityScore(userId: string) {
    const cacheKey = `analytics:productivity:${userId}`
    const cached = cache.get<number>(cacheKey)
    if (cached !== null) return cached

    const score = await measureAsync('analytics:getProductivityScore', async () => {
      const today = new Date()
      const weekAgo = new Date(today)
      weekAgo.setDate(today.getDate() - 7)

      const [completedTasks, trainingHours, healthLogs] = await Promise.all([
        // 假设有任务系统
        prisma.post.count({
          where: {
            userId,
            status: 'PUBLISHED',
            publishedAt: { gte: weekAgo },
          },
        }),
        prisma.trainingNote.count({
          where: { userId, createdAt: { gte: weekAgo } },
        }),
        prisma.healthDailyLog.count({
          where: { userId, date: { gte: weekAgo } },
        }),
      ])

      // 简单的评分算法
      const taskScore = Math.min(completedTasks * 10, 40)
      const trainingScore = Math.min(trainingHours * 5, 30)
      const healthScore = Math.min(healthLogs * 4, 30)

      return Math.round(taskScore + trainingScore + healthScore)
    })

    cache.set(cacheKey, score, 600)
    return score
  }

  // 获取连续天数
  async getStreakDays(userId: string) {
    const cacheKey = `analytics:streak:${userId}`
    const cached = cache.get<number>(cacheKey)
    if (cached !== null) return cached

    const streak = await measureAsync('analytics:getStreakDays', async () => {
      const logs = await prisma.healthDailyLog.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 365,
      })

      if (logs.length === 0) return 0

      let streakDays = 0
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      for (let i = 0; i < logs.length; i++) {
        const logDate = new Date(logs[i].date)
        logDate.setHours(0, 0, 0, 0)
        
        const expectedDate = new Date(today)
        expectedDate.setDate(today.getDate() - i)
        expectedDate.setHours(0, 0, 0, 0)

        if (logDate.getTime() === expectedDate.getTime()) {
          streakDays++
        } else {
          break
        }
      }

      return streakDays
    })

    cache.set(cacheKey, streak, 3600)
    return streak
  }

  // 获取趋势数据
  async getTrends(userId: string) {
    const cacheKey = `analytics:trends:${userId}`
    const cached = cache.get<any>(cacheKey)
    if (cached) return cached

    const trends = await measureAsync('analytics:getTrends', async () => {
      const now = new Date()
      const thisWeekStart = new Date(now)
      thisWeekStart.setDate(now.getDate() - 7)
      const lastWeekStart = new Date(now)
      lastWeekStart.setDate(now.getDate() - 14)

      const [thisWeekHealth, lastWeekHealth] = await Promise.all([
        prisma.healthDailyLog.count({
          where: { userId, date: { gte: thisWeekStart } },
        }),
        prisma.healthDailyLog.count({
          where: {
            userId,
            date: { gte: lastWeekStart, lt: thisWeekStart },
          },
        }),
      ])

      const [thisWeekLearning, lastWeekLearning] = await Promise.all([
        prisma.trainingNote.count({
          where: { userId, createdAt: { gte: thisWeekStart } },
        }),
        prisma.trainingNote.count({
          where: {
            userId,
            createdAt: { gte: lastWeekStart, lt: thisWeekStart },
          },
        }),
      ])

      const [thisWeekPosts, lastWeekPosts] = await Promise.all([
        prisma.post.count({
          where: { userId, createdAt: { gte: thisWeekStart } },
        }),
        prisma.post.count({
          where: {
            userId,
            createdAt: { gte: lastWeekStart, lt: thisWeekStart },
          },
        }),
      ])

      const calculateTrend = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0
        return Math.round(((current - previous) / previous) * 100)
      }

      return {
        health: calculateTrend(thisWeekHealth, lastWeekHealth),
        learning: calculateTrend(thisWeekLearning, lastWeekLearning),
        productivity: calculateTrend(thisWeekPosts, lastWeekPosts),
      }
    })

    cache.set(cacheKey, trends, 600)
    return trends
  }

  // 获取活动热力图数据
  async getActivityHeatmap(userId: string, days: number = 365) {
    const cacheKey = `analytics:heatmap:${userId}:${days}`
    const cached = cache.get<any>(cacheKey)
    if (cached) return cached

    const heatmap = await measureAsync('analytics:getActivityHeatmap', async () => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const logs = await prisma.healthDailyLog.findMany({
        where: {
          userId,
          date: { gte: startDate },
        },
        select: { date: true },
      })

      const activityMap = new Map<string, number>()
      
      logs.forEach(log => {
        const dateStr = log.date.toISOString().split('T')[0]
        activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1)
      })

      return Array.from(activityMap.entries()).map(([date, count]) => ({
        date,
        count,
      }))
    })

    cache.set(cacheKey, heatmap, 3600)
    return heatmap
  }

  // 获取周目标进度
  async getWeeklyGoalProgress(userId: string) {
    const cacheKey = `analytics:weekly-goal:${userId}`
    const cached = cache.get<number>(cacheKey)
    if (cached !== null) return cached

    const progress = await measureAsync('analytics:getWeeklyGoalProgress', async () => {
      const now = new Date()
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      weekStart.setHours(0, 0, 0, 0)

      const [completed, total] = await Promise.all([
        prisma.healthDailyLog.count({
          where: { userId, date: { gte: weekStart } },
        }),
        Promise.resolve(7), // 假设每周目标是7天
      ])

      return Math.round((completed / total) * 100)
    })

    cache.set(cacheKey, progress, 600)
    return progress
  }

  // 获取完整的分析数据
  async getFullAnalytics(userId: string) {
    const [
      activityStats,
      productivityScore,
      streakDays,
      trends,
      activityHeatmap,
      weeklyGoalProgress,
    ] = await Promise.all([
      this.getUserActivityStats(userId),
      this.getProductivityScore(userId),
      this.getStreakDays(userId),
      this.getTrends(userId),
      this.getActivityHeatmap(userId),
      this.getWeeklyGoalProgress(userId),
    ])

    return {
      weeklyGoalProgress,
      productivityScore,
      streakDays,
      totalActivities: activityStats.totalActivities,
      trends,
      activityData: activityHeatmap,
    }
  }
}

export const analyticsService = new AnalyticsService()
