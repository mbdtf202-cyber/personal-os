import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DashboardCardProps {
  title: string
  icon: React.ReactNode
  value: string | number
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
}

export function DashboardCard({
  title,
  icon,
  value,
  description,
  trend,
  action,
  className,
}: DashboardCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className="text-gray-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
        {trend && (
          <div
            className={cn(
              'text-xs mt-2 flex items-center gap-1',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </CardContent>
      {action && (
        <CardFooter>
          <Link
            href={action.href}
            className="text-sm text-blue-600 hover:underline"
          >
            {action.label} →
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}
