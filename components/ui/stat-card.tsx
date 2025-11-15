// 精致的统计卡片组件
'use client'

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    label: string
  }
  icon?: LucideIcon
  iconColor?: string
  trend?: 'up' | 'down' | 'neutral'
  className?: string
  children?: ReactNode
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-blue-500',
  trend = 'neutral',
  className,
  children,
}: StatCardProps) {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  }

  return (
    <div
      className={cn(
        'rounded-[2rem] glass-card soft-shadow p-6 transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]',
        className
      )}
    >
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium theme-text-secondary">
              {title}
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight theme-text-primary">
              {value}
            </p>
            
            {change && (
              <div className={cn('mt-2 flex items-center gap-1 text-sm', trendColors[trend])}>
                <span className="font-semibold">
                  {change.value > 0 ? '+' : ''}{change.value}%
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {change.label}
                </span>
              </div>
            )}
          </div>
          
          {Icon && (
            <div className={cn(
              'rounded-xl p-3',
              'theme-bg-tertiary',
              'transition-transform duration-300 group-hover:scale-110'
            )}>
              <Icon className={cn('h-6 w-6', iconColor)} />
            </div>
          )}
        </div>
        
        {children && (
          <div className="mt-4 pt-4 theme-border" style={{ borderTopWidth: '1px' }}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
