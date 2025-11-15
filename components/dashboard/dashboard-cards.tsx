import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Heart,
  FileText,
  Newspaper,
  Share2,
  TrendingUp,
  FolderKanban,
  Bookmark,
  CheckCircle,
  AlertCircle,
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
        plannedPublishTime: string | Date
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
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Health"
          icon={Heart}
          description="Daily wellbeing snapshot"
          action={{ label: 'Open health hub', href: '/health' }}
        >
          <div className="space-y-3">
            {overview.health.hasLog ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                <CheckCircle className="h-4 w-4" />
                Logged today
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-600 dark:bg-amber-500/20 dark:text-amber-200">
                <AlertCircle className="h-4 w-4" />
                Not logged yet
              </div>
            )}
            {overview.health.pendingHabits > 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-300">
                {overview.health.pendingHabits} habit{overview.health.pendingHabits === 1 ? '' : 's'} waiting for attention.
              </p>
            )}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Blog"
          icon={FileText}
          description="Ideas ready to publish"
          value={overview.blog.draftCount}
          action={{ label: 'Go to blog', href: '/blog' }}
        />

        <DashboardCard
          title="News"
          icon={Newspaper}
          description="Unread curated stories"
          value={overview.news.unreadCount}
          action={{ label: 'Browse news', href: '/news' }}
        />

        <DashboardCard
          title="Social"
          icon={Share2}
          description="Scheduled posts today"
          value={overview.social.scheduledToday}
          action={{ label: 'Open social desk', href: '/social' }}
        />

        <DashboardCard
          title="Trading"
          icon={TrendingUp}
          description="Trades recorded today"
          value={overview.trading.tradesCount}
          action={{ label: 'Review trades', href: '/trading' }}
        />

        <DashboardCard
          title="Projects"
          icon={FolderKanban}
          description="Active focus streams"
          value={overview.projects.activeCount}
          action={{ label: 'View projects', href: '/projects' }}
        />

        <DashboardCard
          title="Bookmarks"
          icon={Bookmark}
          description="Articles saved to read"
          value={overview.bookmarks.toReadCount}
          action={{ label: 'Open bookmarks', href: '/bookmarks' }}
        />
      </div>

      {overview.social.scheduledToday > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-600 dark:text-white">
              Scheduled Posts Today
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.social.posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_18px_40px_rgba(79,70,229,0.18)] dark:border-white/10 dark:bg-white/5"
              >
                <div>
                  <p className="font-medium text-slate-700 dark:text-white">{post.title}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="rounded-full border-white/60 px-2 text-xs text-slate-500 dark:border-white/10 dark:text-slate-200">
                      {post.platform}
                    </Badge>
                    <span className="text-xs text-slate-400 dark:text-slate-300">
                      {new Date(post.plannedPublishTime).toLocaleTimeString()}
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
