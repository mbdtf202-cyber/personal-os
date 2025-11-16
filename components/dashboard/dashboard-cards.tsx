import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import {
  Heart,
  FileText,
  Newspaper,
  Share2,
  TrendingUp,
  FolderKanban,
  Bookmark,
  ArrowRight,
} from 'lucide-react'

interface DashboardCardsProps {
  overview: {
    health: {
      hasLog: boolean
      pendingHabits: number
    }
    blog: {
      draftCount: number
    }
    news: {
      unreadCount: number
    }
    social: {
      scheduledToday: number
      posts: Array<{
        id: string
        title: string
        platform: string
        plannedPublishTime: Date | null
        status: string
        url: string | null
        createdAt: Date
        updatedAt: Date
        userId: string
        contentText: string
        actualPublishTime: Date | null
      }>
    }
    trading: {
      tradesCount: number
    }
    projects: {
      activeCount: number
    }
    bookmarks: {
      toReadCount: number
    }
  }
}

export function DashboardCards({ overview }: DashboardCardsProps) {
  const cards = [
    {
      title: '健康追踪',
      value: overview.health.pendingHabits,
      unit: '待完成习惯',
      description:
        overview.health.pendingHabits > 0
          ? `${overview.health.pendingHabits} 个习惯待完成`
          : '已完成今日所有习惯',
      icon: Heart,
      chip: overview.health.hasLog ? '今日已记录' : '等待记录',
      gradient: 'mint' as const,
      progress: overview.health.hasLog ? 100 : 45,
      href: '/health',
    },
    {
      title: '博客草稿',
      value: overview.blog.draftCount,
      unit: '篇',
      description: '灵感草稿等待打磨',
      icon: FileText,
      chip: overview.blog.draftCount > 0 ? '草稿箱' : '空空如也',
      gradient: 'lavender' as const,
      progress: Math.min(overview.blog.draftCount * 20, 90),
      href: '/blog',
    },
    {
      title: '未读新闻',
      value: overview.news.unreadCount,
      unit: '条',
      description: '精选资讯保持输入',
      icon: Newspaper,
      chip: '阅读清单',
      gradient: 'sunset' as const,
      progress: Math.min(overview.news.unreadCount * 10, 90),
      href: '/news',
    },
    {
      title: '今日发布',
      value: overview.social.scheduledToday,
      unit: '篇',
      description: '社交内容排期',
      icon: Share2,
      chip: overview.social.scheduledToday > 0 ? '排期就绪' : '待安排',
      gradient: 'aqua' as const,
      progress: overview.social.scheduledToday > 0 ? 70 : 30,
      href: '/social',
    },
    {
      title: '今日交易',
      value: overview.trading.tradesCount,
      unit: '笔',
      description: '记录市场表现',
      icon: TrendingUp,
      chip: '市场节奏',
      gradient: 'mint' as const,
      progress: Math.min(overview.trading.tradesCount * 25, 100),
      href: '/trading',
    },
    {
      title: '活跃项目',
      value: overview.projects.activeCount,
      unit: '个',
      description: '正在推进的项目',
      icon: FolderKanban,
      chip: '项目节奏',
      gradient: 'iris' as const,
      progress: Math.min(overview.projects.activeCount * 15, 95),
      href: '/projects',
    },
    {
      title: '待读书签',
      value: overview.bookmarks.toReadCount,
      unit: '条',
      description: '灵感收集箱',
      icon: Bookmark,
      chip: '灵感输入',
      gradient: 'sunset' as const,
      progress: Math.min(overview.bookmarks.toReadCount * 8, 90),
      href: '/bookmarks',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <GlassCard hover gradient={card.gradient} className="group h-full">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/35 text-slate-700 flex items-center justify-center shadow-inner">
                      <card.icon className="h-6 w-6" />
                    </div>
                    <div className="ios-pill text-[11px] font-semibold uppercase tracking-widest">
                      {card.chip}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-600 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
                <div className="mt-6">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">
                    {card.title}
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-slate-900 dark:text-white">
                      {card.value}
                    </p>
                    {card.unit && <span className="text-sm text-slate-600">{card.unit}</span>}
                  </div>
                  <p className="text-sm text-slate-600/80 mt-2">
                    {card.description}
                  </p>
                  {typeof card.progress === 'number' && (
                    <div className="mt-4 h-2 rounded-full bg-white/40 dark:bg-white/10 overflow-hidden">
                      <span
                        className="block h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400"
                        style={{ width: `${card.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      {overview.social.scheduledToday > 0 && (
        <GlassCard gradient="iris">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-700 dark:text-white">
              今日排期
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.social.posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_18px_40px_rgba(79,70,229,0.18)] dark:border-white/10 dark:bg-white/5"
              >
                <div>
                  <p className="font-medium theme-text-primary">{post.title}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="rounded-full theme-border px-2 text-xs theme-text-secondary" style={{ borderWidth: '1px' }}>
                      {post.platform}
                    </Badge>
                    <span className="text-xs theme-text-tertiary">
                      {post.plannedPublishTime ? new Date(post.plannedPublishTime).toLocaleTimeString() : '未定时'}
                    </span>
                  </div>
                </div>
                <Link href="/social">
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                    查看
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </GlassCard>
      )}
    </div>
  )
}
