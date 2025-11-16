import { ReactNode } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
  accent?: 'iris' | 'lavender' | 'sunset' | 'mint' | 'aqua' | 'none'
  className?: string
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  accent = 'aqua',
  className,
}: PageHeaderProps) {
  return (
    <GlassCard
      gradient={accent}
      className={cn(
        'p-6 md:p-10',
        'backdrop-saturate-150 border-white/50 dark:border-white/10',
        className,
      )}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          {eyebrow && (
            <p className="text-xs uppercase tracking-[0.3em] theme-text-tertiary">{eyebrow}</p>
          )}
          <div>
            <h1 className="text-3xl font-semibold tracking-tight theme-text-primary">
              {title}
            </h1>
            {description && (
              <p className="mt-2 max-w-2xl text-base leading-relaxed theme-text-secondary">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {actions}
          </div>
        )}
      </div>
    </GlassCard>
  )
}
