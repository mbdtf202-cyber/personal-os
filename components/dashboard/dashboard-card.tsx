import type { ElementType, ReactNode } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DashboardCardProps {
  title: string
  icon: ElementType<{ className?: string }>
  value?: string | number
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  action?: {
    label: string
    href: string
  }
  className?: string
  children?: ReactNode
}

export function DashboardCard({
  title,
  icon: Icon,
  value,
  description,
  trend,
  action,
  className,
  children,
}: DashboardCardProps) {
  return (
    <Card className={cn('relative overflow-hidden p-0', className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/40 to-white/20 dark:from-white/10 dark:via-white/5 dark:to-transparent" aria-hidden />
      <CardHeader className="relative flex flex-row items-start justify-between space-y-0 px-6 pb-2 pt-6">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
            {title}
          </CardTitle>
          {description && (
            <p className="text-xs text-slate-400 dark:text-slate-300/80">{description}</p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 via-indigo-100 to-purple-100 text-sky-500 shadow-inner shadow-white/60 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="relative px-6 pb-6">
        {children ? (
          children
        ) : (
          <>
            <div className="text-3xl font-semibold text-slate-700 dark:text-white">{value}</div>
            {trend && (
              <div
                className={cn(
                  'mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
                  trend.isPositive
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300'
                )}
              >
                <span>{trend.isPositive ? '↑' : '↓'}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </>
        )}
      </CardContent>
      {action && (
        <CardFooter className="relative px-6 pb-6">
          <Link
            href={action.href}
            className="text-sm font-semibold text-sky-600 transition hover:text-indigo-500"
          >
            {action.label} →
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}
