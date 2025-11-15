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
      value: overview.health.hasLog ? '已记录' : '未记录',
      description:
        overview.health.pendingHabits > 0
          ? `${overview.health.pendingHabits} 个习惯待完成`
          : '记录今日状态保持节奏',
      icon: Heart,
      href: '/health',
    },
    {
      title: '博客草稿',
      value: overview.blog.draftCount,
      description: '灵感草稿等待打磨',
      icon: FileText,
      href: '/blog',
    },
    {
      title: '未读新闻',
      value: overview.news.unreadCount,
      description: '精选资讯保持输入',
      icon: Newspaper,
      href: '/news',
    },
    {
      title: '今日发布',
      value: overview.social.scheduledToday,
      description: '社交内容排期',
      icon: Share2,
      href: '/social',
    },
    {
      title: '今日交易',
      value: overview.trading.tradesCount,
      description: '记录市场表现',
      icon: TrendingUp,
      href: '/trading',
    },
    {
      title: '活跃项目',
      value: overview.projects.activeCount,
      description: '正在推进的项目',
      icon: FolderKanban,
      href: '/projects',
    },
    {
      title: '待读书签',
      value: overview.bookmarks.toReadCount,
      description: '灵感收集箱',
      icon: Bookmark,
      href: '/bookmarks',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <GlassCard hover>
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full theme-btn-primary flex items-center justify-center">
                    <card.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium theme-text-tertiary mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl font-semibold theme-text-primary">
                    {card.value}
                  </p>
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      {overview.social.scheduledToday > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Scheduled Posts Today</CardTitle>
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
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
