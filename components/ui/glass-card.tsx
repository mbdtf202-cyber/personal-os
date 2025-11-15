// 玻璃态卡片组件 - 现代艺术感设计
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  gradient?: 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'none'
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  gradient = 'none',
}: GlassCardProps) {
  const gradients = {
    purple: 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(147, 51, 234) 100%)',
    blue: 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(37, 99, 235) 100%)',
    green: 'linear-gradient(135deg, rgb(34, 197, 94) 0%, rgb(22, 163, 74) 100%)',
    orange: 'linear-gradient(135deg, rgb(251, 146, 60) 0%, rgb(249, 115, 22) 100%)',
    pink: 'linear-gradient(135deg, rgb(236, 72, 153) 0%, rgb(219, 39, 119) 100%)',
    none: '',
  }

  return (
    <div
      className={cn(
        'rounded-[2rem] glass-card soft-shadow',
        hover && 'transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]',
        className
      )}
      style={gradient !== 'none' ? {
        background: gradients[gradient],
      } : undefined}
    >
      {children}
    </div>
  )
}
