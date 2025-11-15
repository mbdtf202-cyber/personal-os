// 活动热力图组件
'use client'

import { cn } from '@/lib/utils'
import { useMemo } from 'react'

interface ActivityData {
  date: string
  count: number
}

interface ActivityHeatmapProps {
  data: ActivityData[]
  className?: string
}

export function ActivityHeatmap({ data, className }: ActivityHeatmapProps) {
  const weeks = useMemo(() => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - 364) // 52 weeks

    const dataMap = new Map(data.map(d => [d.date, d.count]))
    const weeks: Array<Array<{ date: Date; count: number }>> = []
    
    let currentWeek: Array<{ date: Date; count: number }> = []
    let currentDate = new Date(startDate)

    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0]
      currentWeek.push({
        date: new Date(currentDate),
        count: dataMap.get(dateStr) || 0,
      })

      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    return weeks
  }, [data])

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800'
    if (count <= 2) return 'bg-green-200 dark:bg-green-900'
    if (count <= 5) return 'bg-green-400 dark:bg-green-700'
    if (count <= 10) return 'bg-green-600 dark:bg-green-500'
    return 'bg-green-800 dark:bg-green-300'
  }

  const maxCount = Math.max(...data.map(d => d.count), 1)

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          活动热力图
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>少</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn(
                  'h-3 w-3 rounded-sm',
                  getColor(level * (maxCount / 4))
                )}
              />
            ))}
          </div>
          <span>多</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={cn(
                    'h-3 w-3 rounded-sm transition-all duration-200 hover:ring-2 hover:ring-blue-500',
                    getColor(day.count)
                  )}
                  title={`${day.date.toLocaleDateString()}: ${day.count} 活动`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
