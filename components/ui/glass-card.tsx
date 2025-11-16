// 玻璃态卡片组件 - 现代艺术感设计
import { cn } from '@/lib/utils'
import { ReactNode, CSSProperties } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  gradient?: 'iris' | 'lavender' | 'sunset' | 'mint' | 'aqua' | 'none'
  style?: CSSProperties
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  gradient = 'none',
  style,
}: GlassCardProps) {
  const gradients = {
    iris: 'linear-gradient(135deg, rgba(254, 247, 255, 0.95) 0%, rgba(222, 213, 255, 0.95) 45%, rgba(205, 225, 255, 0.9) 100%)',
    lavender: 'linear-gradient(135deg, rgba(244, 230, 255, 0.9) 0%, rgba(210, 210, 255, 0.95) 100%)',
    sunset: 'linear-gradient(135deg, rgba(255, 234, 211, 0.95) 0%, rgba(255, 214, 236, 0.9) 100%)',
    mint: 'linear-gradient(135deg, rgba(219, 248, 255, 0.9) 0%, rgba(217, 255, 230, 0.9) 100%)',
    aqua: 'linear-gradient(135deg, rgba(226, 240, 255, 0.95) 0%, rgba(206, 220, 255, 0.85) 100%)',
    none: '',
  }

  return (
    <div
      className={cn(
        'rounded-[2rem] glass-card soft-shadow transition-all duration-300',
        hover &&
          'hover:-translate-y-1 hover:shadow-[0_25px_65px_rgba(79,70,229,0.15)] motion-safe:hover:animate-[float_6s_ease-in-out_infinite]',
        glow &&
          'after:absolute after:inset-0 after:-z-10 after:rounded-[2.5rem] after:bg-white/30 after:blur-3xl',
        className,
      )}
      style={{
        ...(gradient !== 'none' ? { backgroundImage: gradients[gradient] } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  )
}
