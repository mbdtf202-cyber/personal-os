// AI 智能建议组件
'use client'

import { useState, useEffect, useCallback } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Sparkles, TrendingUp, Target, Lightbulb, X, Rocket, Gauge } from 'lucide-react'
import { cn } from '@/lib/utils'

type ExtendedWindow = Window & typeof globalThis & {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
  cancelIdleCallback?: (handle: number) => void
}

interface Suggestion {
  id: string
  type: 'insight' | 'action' | 'tip' | 'goal' | 'upgrade' | 'performance'
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
}

interface SmartSuggestionsProps {
  userId: string
  className?: string
}

export function SmartSuggestions({ userId, className }: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const loadSuggestions = useCallback(async () => {
    void userId
    setLoading(true)
    try {
      // 模拟 AI 生成的建议
      const mockSuggestions: Suggestion[] = [
        {
          id: '1',
          type: 'insight',
          title: '学习进度良好',
          description: '本周你在前端开发领域投入了 12 小时，比上周增加了 30%',
          action: {
            label: '查看详情',
            href: '/training',
          },
        },
        {
          id: '2',
          type: 'action',
          title: '建议记录今日健康数据',
          description: '你已经连续 7 天记录健康数据，保持这个好习惯！',
          action: {
            label: '立即记录',
            href: '/health',
          },
        },
        {
          id: '3',
          type: 'tip',
          title: '优化建议',
          description: '你有 15 个待读书签，建议每天阅读 2-3 篇文章',
          action: {
            label: '开始阅读',
            href: '/bookmarks',
          },
        },
        {
          id: '4',
          type: 'goal',
          title: '本周目标',
          description: '完成 3 个项目任务，目前已完成 1 个',
          action: {
            label: '查看项目',
            href: '/projects',
          },
        },
        {
          id: '5',
          type: 'upgrade',
          title: '功能优化：统一提醒中心',
          description: '建议把健康、交易、项目等提醒聚合在一个系统通知中心，方便跨设备同步。',
          action: {
            label: '查看路线图',
            href: '/workflows',
          },
        },
        {
          id: '6',
          type: 'performance',
          title: '性能优化：控制中心懒加载',
          description: '快速操作弹窗已采用按需加载，首屏 JS 体积减少 18%，交互响应更快。',
        },
      ]

      setSuggestions(mockSuggestions)
    } catch (error) {
      console.error('Failed to load suggestions:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const extendedWindow = window as ExtendedWindow
    const idleCallback = extendedWindow.requestIdleCallback
    if (typeof idleCallback === 'function') {
      const id = idleCallback(() => loadSuggestions())
      return () => extendedWindow.cancelIdleCallback?.(id)
    }

    const timer = setTimeout(() => loadSuggestions(), 100)
    return () => clearTimeout(timer)
  }, [loadSuggestions])

  const handleDismiss = (id: string) => {
    setDismissed(new Set([...dismissed, id]))
  }

  const getIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'insight':
        return <TrendingUp className="h-5 w-5" />
      case 'action':
        return <Target className="h-5 w-5" />
      case 'tip':
        return <Lightbulb className="h-5 w-5" />
      case 'goal':
        return <Sparkles className="h-5 w-5" />
      case 'upgrade':
        return <Rocket className="h-5 w-5" />
      case 'performance':
        return <Gauge className="h-5 w-5" />
    }
  }

  const getColor = (type: Suggestion['type']) => {
    switch (type) {
      case 'insight':
        return 'text-blue-500'
      case 'action':
        return 'text-green-500'
      case 'tip':
        return 'text-yellow-500'
      case 'goal':
        return 'text-purple-500'
      case 'upgrade':
        return 'text-pink-500'
      case 'performance':
        return 'text-indigo-500'
    }
  }

  const getGradient = (type: Suggestion['type']) => {
    switch (type) {
      case 'insight':
        return 'from-sky-50 via-slate-50 to-white dark:from-sky-950/20 dark:to-slate-900/40'
      case 'action':
        return 'from-emerald-50 via-lime-50 to-white dark:from-emerald-950/20 dark:to-slate-900/40'
      case 'tip':
        return 'from-amber-50 via-orange-50 to-white dark:from-amber-900/30 dark:to-slate-900/40'
      case 'goal':
        return 'from-purple-50 via-pink-50 to-white dark:from-purple-900/30 dark:to-slate-900/40'
      case 'upgrade':
        return 'from-rose-50 via-fuchsia-50 to-white dark:from-rose-900/30 dark:to-slate-900/40'
      case 'performance':
        return 'from-indigo-50 via-blue-50 to-white dark:from-indigo-950/20 dark:to-slate-900/40'
    }
  }

  const visibleSuggestions = suggestions.filter(s => !dismissed.has(s.id))

  if (loading) {
    return (
      <GlassCard className={className}>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 theme-color-primary" />
            <h3 className="font-semibold theme-text-primary">
              AI 智能建议
            </h3>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 theme-bg-tertiary rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </GlassCard>
    )
  }

  if (visibleSuggestions.length === 0) {
    return null
  }

  return (
    <GlassCard className={className}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 theme-color-primary" />
          <h3 className="font-semibold theme-text-primary">
            AI 智能建议
          </h3>
        </div>
        
        <div className="space-y-3">
          {visibleSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={cn(
                'group relative rounded-2xl border border-white/60 bg-gradient-to-br p-4 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-white/10',
                getGradient(suggestion.type),
              )}
            >
              <button
                onClick={() => handleDismiss(suggestion.id)}
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity theme-text-tertiary hover:theme-text-secondary"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-start gap-3">
                <div className={cn('mt-0.5 rounded-2xl bg-white/60 p-3 shadow-inner', getColor(suggestion.type))}>
                  {getIcon(suggestion.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium theme-text-primary mb-1">
                    {suggestion.title}
                  </h4>
                  <p className="text-sm theme-text-secondary mb-3">
                    {suggestion.description}
                  </p>
                  {suggestion.action && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="theme-color-primary hover:opacity-80"
                      onClick={() => window.location.href = suggestion.action!.href}
                    >
                      {suggestion.action.label} →
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}
