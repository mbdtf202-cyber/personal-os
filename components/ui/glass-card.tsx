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
    purple: 'from-purple-500/10 via-transparent to-transparent',
    blue: 'from-blue-500/10 via-transparent to-transparent',
    green: 'from-green-500/10 via-transparent to-transparent',
    orange: 'from-orange-500/10 via-transparent to-transparent',
    pink: 'from-pink-500/10 via-transparent to-transparent',
    none: '',
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'backdrop-blur-xl theme-bg-secondary',
        'theme-border',
        'shadow-xl shadow-black/5',
        hover && 'transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1',
        glow && 'before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-br before:from-white/40 before:to-transparent before:-z-10',
        className
      )}
      style={{
        borderWidth: '1px',
      }}
    >
      {gradient !== 'none' && (
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-50',
            gradients[gradient]
          )}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
