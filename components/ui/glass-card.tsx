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
  return (
    <div
      className={cn(
        'rounded-2xl theme-bg-secondary border theme-border',
        hover && 'transition-all duration-200 hover:shadow-sm active:scale-[0.98]',
        className
      )}
      style={{
        borderWidth: '1px',
      }}
    >
      {children}
    </div>
  )
}
