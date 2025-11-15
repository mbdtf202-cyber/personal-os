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
    purple: 'linear-gradient(135deg, rgba(168, 85, 247, 0.8) 0%, rgba(147, 51, 234, 0.9) 100%)',
    blue: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(37, 99, 235, 0.9) 100%)',
    green: 'linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(22, 163, 74, 0.9) 100%)',
    orange: 'linear-gradient(135deg, rgba(251, 146, 60, 0.8) 0%, rgba(249, 115, 22, 0.9) 100%)',
    pink: 'linear-gradient(135deg, rgba(236, 72, 153, 0.8) 0%, rgba(219, 39, 119, 0.9) 100%)',
    none: '',
  }

  return (
    <div
      className={cn(
        'rounded-[2rem] glass-card soft-shadow',
        hover && 'transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]',
        className
      )}
      style={gradient !== 'none' ? {
        background: gradients[gradient],
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      } : undefined}
    >
      {children}
    </div>
  )
}
