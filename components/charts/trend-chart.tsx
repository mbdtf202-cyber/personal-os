// 趋势图表组件
'use client'

import { useMemo } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

interface DataPoint {
  date: string
  value: number
  label?: string
}

interface TrendChartProps {
  data: DataPoint[]
  type?: 'line' | 'area'
  color?: string
  height?: number
  showGrid?: boolean
  className?: string
}

export function TrendChart({
  data,
  type = 'area',
  color = '#3b82f6',
  height = 300,
  showGrid = true,
  className,
}: TrendChartProps) {
  const chartData = useMemo(() => {
    return data.map(point => ({
      ...point,
      displayDate: new Date(point.date).toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
      }),
    }))
  }, [data])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {payload[0].payload.label || payload[0].payload.displayDate}
          </p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
            {payload[0].value}
          </p>
        </div>
      )
    }
    return null
  }

  const Chart = type === 'area' ? AreaChart : LineChart

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <Chart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-gray-200 dark:text-gray-700"
            />
          )}
          <XAxis
            dataKey="displayDate"
            stroke="currentColor"
            className="text-gray-500 dark:text-gray-400"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="currentColor"
            className="text-gray-500 dark:text-gray-400"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          {type === 'area' ? (
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={color}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          ) : (
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
        </Chart>
      </ResponsiveContainer>
    </div>
  )
}
