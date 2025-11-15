// GitHub 风格的日历热力图
'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/date-utils'

interface CalendarHeatmapProps {
  data: Array<{ date: string; value: number }>
  startDate?: Date
  endDate?: Date
  colorScale?: string[]
  className?: string
}

export function CalendarHeatmap({
  data,
  startDate,
  endDate,
  colorScale = [
    'bg-slate-100 dark:bg-slate-800',
    'bg-emerald-200 dark:bg-emerald-900',
    'bg-emerald-400 dark:bg-emerald-700',
    'bg-emerald-600 dark:bg-emerald-500',
    'bg-emerald-800 dark:bg-emerald-300',
  ],
  className,
}: CalendarHeatmapProps) {
  const { weeks, maxValue } = useMemo(() => {
    const end = endDate || new Date()
    const start = startDate || new Date(end.getTime() - 365 * 24 * 60 * 60 * 1000)

    const dataMap = new Map(data.map((d) => [d.date, d.value]))
    const weeks: Array<Array<{ date: Date; value: number }>> = []
    let currentWeek: Array<{ date: Date; value: number }> = []
    let currentDate = new Date(start)
    let maxVal = 0

    // 填充到周日开始
    const startDay = currentDate.getDay()
    for (let i = 0; i < startDay; i++) {
      currentWeek.push({ date: new Date(0), value: -1 })
    }

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const value = dataMap.get(dateStr) || 0
      maxVal = Math.max(maxVal, value)

      currentWeek.push({
        date: new Date(currentDate),
        value,
      })

      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: new Date(0), value: -1 })
      }
      weeks.push(currentWeek)
    }

    return { weeks, maxValue: maxVal }
  }, [data, startDate, endDate])

  const getColor = (value: number) => {
    if (value === -1) return 'bg-transparent'
    if (value === 0) return colorScale[0]
    const percentage = value / maxValue
    if (percentage <= 0.25) return colorScale[1]
    if (percentage <= 0.5) return colorScale[2]
    if (percentage <= 0.75) return colorScale[3]
    return colorScale[4]
  }

  const monthLabels = useMemo(() => {
    const labels: Array<{ month: string; weekIndex: number }> = []
    let lastMonth = -1

    weeks.forEach((week, index) => {
      const firstDay = week.find((d) => d.value !== -1)
      if (firstDay && firstDay.date.getTime() > 0) {
        const month = firstDay.date.getMonth()
        if (month !== lastMonth) {
          labels.push({
            month: firstDay.date.toLocaleDateString('zh-CN', { month: 'short' }),
            weekIndex: index,
          })
          lastMonth = month
        }
      }
    })

    return labels
  }, [weeks])

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>活动日历</span>
        <div className="flex items-center gap-2">
          <span>少</span>
          <div className="flex gap-1">
            {colorScale.map((color, i) => (
              <div key={i} className={cn('h-3 w-3 rounded-sm', color)} />
            ))}
          </div>
          <span>多</span>
        </div>
      </div>

      <div className="relative">
        {/* 月份标签 */}
        <div className="flex gap-1 mb-1 text-xs text-gray-500 dark:text-gray-400">
          {monthLabels.map((label, i) => (
            <div
              key={i}
              style={{ marginLeft: i === 0 ? 0 : `${(label.weekIndex - (monthLabels[i - 1]?.weekIndex || 0)) * 14}px` }}
            >
              {label.month}
            </div>
          ))}
        </div>

        {/* 热力图 */}
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={cn(
                    'h-3 w-3 rounded-sm transition-all duration-200',
                    'hover:ring-2 hover:ring-amber-500 hover:scale-110',
                    getColor(day.value)
                  )}
                  title={
                    day.value >= 0 && day.date.getTime() > 0
                      ? `${formatDate(day.date, 'long')}: ${day.value} 活动`
                      : ''
                  }
                />
              ))}
            </div>
          ))}
        </div>

        {/* 星期标签 */}
        <div className="absolute -left-8 top-8 flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
          <div className="h-3">一</div>
          <div className="h-3"></div>
          <div className="h-3">三</div>
          <div className="h-3"></div>
          <div className="h-3">五</div>
          <div className="h-3"></div>
          <div className="h-3">日</div>
        </div>
      </div>
    </div>
  )
}
