import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const userId = await requireAuth()
    
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

    // 总活动数
    const totalActivities = await prisma.healthDailyLog.count({ where: { userId } })

    // 周变化
    const thisWeek = await prisma.healthDailyLog.count({
      where: { userId, date: { gte: weekAgo } },
    })
    const lastWeek = await prisma.healthDailyLog.count({
      where: {
        userId,
        date: {
          gte: new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000),
          lt: weekAgo,
        },
      },
    })
    const weeklyChange = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0

    // 月变化
    const thisMonth = await prisma.healthDailyLog.count({
      where: { userId, date: { gte: monthAgo } },
    })
    const lastMonth = await prisma.healthDailyLog.count({
      where: {
        userId,
        date: {
          gte: new Date(monthAgo.getTime() - 30 * 24 * 60 * 60 * 1000),
          lt: monthAgo,
        },
      },
    })
    const monthlyChange = lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0

    // 趋势数据（最近30天）
    const logs = await prisma.healthDailyLog.findMany({
      where: { userId, date: { gte: monthAgo } },
      orderBy: { date: 'asc' },
    })

    const trendsMap = new Map<string, number>()
    logs.forEach((log) => {
      const dateStr = log.date.toISOString().split('T')[0]
      trendsMap.set(dateStr, (trendsMap.get(dateStr) || 0) + 1)
    })

    const trends = Array.from(trendsMap.entries()).map(([date, value]) => ({
      date,
      value,
    }))

    // 分布数据
    const distribution = [
      { name: '健康', value: await prisma.healthDailyLog.count({ where: { userId } }) },
      { name: '博客', value: await prisma.post.count({ where: { userId } }) },
      { name: '项目', value: await prisma.project.count({ where: { userId } }) },
      { name: '书签', value: await prisma.bookmark.count({ where: { userId } }) },
      { name: '交易', value: await prisma.trade.count({ where: { userId } }) },
    ]

    // 热力图数据（最近一年）
    const yearLogs = await prisma.healthDailyLog.findMany({
      where: { userId, date: { gte: yearAgo } },
      select: { date: true },
    })

    const heatmapMap = new Map<string, number>()
    yearLogs.forEach((log) => {
      const dateStr = log.date.toISOString().split('T')[0]
      heatmapMap.set(dateStr, (heatmapMap.get(dateStr) || 0) + 1)
    })

    const heatmap = Array.from(heatmapMap.entries()).map(([date, value]) => ({
      date,
      value,
    }))

    return NextResponse.json({
      overview: {
        totalActivities,
        weeklyChange,
        monthlyChange,
      },
      trends,
      distribution,
      heatmap,
    })
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
