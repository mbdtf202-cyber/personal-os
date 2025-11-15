// 统计仪表板
'use client'

import { useEffect, useState } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { TrendChart } from '@/components/charts/trend-chart'
import { BarChart } from '@/components/charts/bar-chart'
import { CalendarHeatmap } from '@/components/charts/calendar-heatmap'
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatsData {
  overview: {
    totalActivities: number
    weeklyChange: number
    monthlyChange: number
  }
  trends: Array<{ date: string; value: number }>
  distribution: Array<{ name: string; value: number }>
  heatmap: Array<{ date: string; value: number }>
}

export function StatsDashboard() {
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const response = await fetch('/api/stats/dashboard')
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <GlassCard key={i}>
            <div className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          </GlassCard>
        ))}
      </div>
    )
  }

  if (!data) return null

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-emerald-600" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-rose-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-emerald-600'
    if (change < 0) return 'text-rose-600'
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* 概览卡片 */}
      <div className="grid gap-6 md:grid-cols-3">
        <GlassCard hover>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">总活动数</span>
              <Activity className="h-5 w-5 text-slate-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {data.overview.totalActivities}
            </div>
          </div>
        </GlassCard>

        <GlassCard hover>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">周变化</span>
              {getTrendIcon(data.overview.weeklyChange)}
            </div>
            <div className={`text-3xl font-bold ${getTrendColor(data.overview.weeklyChange)}`}>
              {data.overview.weeklyChange > 0 ? '+' : ''}
              {data.overview.weeklyChange}%
            </div>
          </div>
        </GlassCard>

        <GlassCard hover>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">月变化</span>
              {getTrendIcon(data.overview.monthlyChange)}
            </div>
            <div className={`text-3xl font-bold ${getTrendColor(data.overview.monthlyChange)}`}>
              {data.overview.monthlyChange > 0 ? '+' : ''}
              {data.overview.monthlyChange}%
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 趋势图 */}
      <GlassCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">活动趋势</h3>
          <TrendChart data={data.trends} type="area" color="#0f766e" height={250} />
        </div>
      </GlassCard>

      {/* 分布图 */}
      <GlassCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">活动分布</h3>
          <BarChart data={data.distribution} height={250} />
        </div>
      </GlassCard>

      {/* 热力图 */}
      <GlassCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">年度活动热力图</h3>
          <CalendarHeatmap data={data.heatmap} />
        </div>
      </GlassCard>
    </div>
  )
}
