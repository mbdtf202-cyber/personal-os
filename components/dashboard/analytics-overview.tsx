// 数据分析概览组件
'use client'

import { GlassCard } from '@/components/ui/glass-card'
import { ProgressRing } from '@/components/analytics/progress-ring'
import { ActivityHeatmap } from '@/components/analytics/activity-heatmap'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap,
  Award,
  Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnalyticsData {
  weeklyGoalProgress: number
  productivityScore: number
  streakDays: number
  totalActivities: number
  trends: {
    health: number
    learning: number
    productivity: number
  }
  activityData: Array<{ date: string; count: number }>
}

interface AnalyticsOverviewProps {
  data: AnalyticsData
  className?: string
}

export function AnalyticsOverview({ data, className }: AnalyticsOverviewProps) {
  const getTrendIcon = (value: number) => {
    return value >= 0 ? TrendingUp : TrendingDown
  }

  const getTrendColor = (value: number) => {
    return value >= 0 ? 'text-green-500' : 'text-red-500'
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* 核心指标 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <GlassCard hover gradient="blue">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-blue-500/10 p-3">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                本周目标
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {data.weeklyGoalProgress}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  已完成
                </p>
              </div>
              <ProgressRing
                progress={data.weeklyGoalProgress}
                size={60}
                strokeWidth={6}
                color="#3b82f6"
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard hover gradient="purple">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-purple-500/10 p-3">
                <Zap className="h-6 w-6 text-purple-500" />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                生产力
              </span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {data.productivityScore}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  +12% 本周
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard hover gradient="orange">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-orange-500/10 p-3">
                <Award className="h-6 w-6 text-orange-500" />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                连续天数
              </span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {data.streakDays}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                保持记录
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard hover gradient="green">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-green-500/10 p-3">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                总活动
              </span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {data.totalActivities}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                本月
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 趋势分析 */}
      <GlassCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            领域趋势
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(data.trends).map(([key, value]) => {
              const Icon = getTrendIcon(value)
              const colorClass = getTrendColor(value)
              
              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                      {key === 'health' ? '健康' : key === 'learning' ? '学习' : '生产力'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Icon className={cn('h-4 w-4', colorClass)} />
                      <span className={cn('text-lg font-bold', colorClass)}>
                        {value > 0 ? '+' : ''}{value}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </GlassCard>

      {/* 活动热力图 */}
      <GlassCard>
        <div className="p-6">
          <ActivityHeatmap data={data.activityData} />
        </div>
      </GlassCard>
    </div>
  )
}
