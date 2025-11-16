import { ReactNode } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { cn } from '@/lib/utils'

type SectionSurface = 'glass' | 'muted'

interface PageSectionProps {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
  surface?: SectionSurface
}

export function PageSection({
  title,
  description,
  actions,
  children,
  className,
  surface = 'glass',
}: PageSectionProps) {
  const content = (
    <div className="flex flex-col gap-6">
      {(title || description || actions) && (
        <div className="flex flex-col gap-4 border-b border-white/40 pb-4 last:border-0 md:flex-row md:items-center md:justify-between dark:border-white/10">
          <div>
            {title && (
              <h2 className="text-xl font-semibold theme-text-primary">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm theme-text-secondary">{description}</p>
            )}
          </div>
          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>
      )}
      <div className="space-y-6">{children}</div>
    </div>
  )

  if (surface === 'muted') {
    return (
      <section
        className={cn(
          'rounded-[1.75rem] border theme-border p-6 md:p-8',
          className,
        )}
        style={{ background: 'var(--bg-secondary)' }}
      >
        {content}
      </section>
    )
  }

  return (
    <GlassCard className={cn('p-6 md:p-8', className)}>{content}</GlassCard>
  )
}
