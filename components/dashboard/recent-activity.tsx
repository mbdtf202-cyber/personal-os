import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'

interface RecentActivityProps {
  activity: {
    posts: Array<{
      id: string
      title: string
      status: string
      updatedAt: Date
    }>
    trades: Array<{
      id: string
      symbol: string
      pnl: number
      date: Date
    }>
    projects: Array<{
      id: string
      title: string
      status: string
      updatedAt: Date
    }>
  }
}

export function RecentActivity({ activity }: RecentActivityProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-600 dark:text-white">
            Recent Blog Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.posts.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/60 bg-white/60 p-6 text-sm text-slate-400 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              No recent posts
            </p>
          ) : (
            <div className="space-y-3">
              {activity.posts.slice(0, 5).map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_18px_40px_rgba(79,70,229,0.18)] dark:border-white/10 dark:bg-white/5"
                >
                  <Link href={`/blog/${post.id}`} className="text-sm font-medium text-slate-700 hover:text-sky-600 dark:text-white">
                    {post.title}
                  </Link>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="rounded-full border-white/60 px-2 text-xs text-slate-500 dark:border-white/10 dark:text-slate-200">
                      {post.status}
                    </Badge>
                    <span className="text-xs text-slate-400 dark:text-slate-300">
                      {format(new Date(post.updatedAt), 'MMM dd')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-600 dark:text-white">
            Recent Trades
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.trades.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/60 bg-white/60 p-6 text-sm text-slate-400 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              No recent trades
            </p>
          ) : (
            <div className="space-y-3">
              {activity.trades.slice(0, 5).map((trade) => (
                <div
                  key={trade.id}
                  className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_18px_40px_rgba(79,70,229,0.18)] dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-white">{trade.symbol}</span>
                    <span
                      className={
                        Number(trade.pnl) >= 0
                          ? 'text-sm font-semibold text-emerald-500'
                          : 'text-sm font-semibold text-rose-500'
                      }
                    >
                      ${Number(trade.pnl) >= 0 ? '+' : ''}{Number(trade.pnl).toFixed(2)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-300">
                    {format(new Date(trade.date), 'MMM dd')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-600 dark:text-white">
            Active Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.projects.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/60 bg-white/60 p-6 text-sm text-slate-400 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              No active projects
            </p>
          ) : (
            <div className="space-y-3">
              {activity.projects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_18px_40px_rgba(79,70,229,0.18)] dark:border-white/10 dark:bg-white/5"
                >
                  <Link href={`/projects`} className="text-sm font-medium text-slate-700 hover:text-sky-600 dark:text-white">
                    {project.title}
                  </Link>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="rounded-full border-white/60 px-2 text-xs text-slate-500 dark:border-white/10 dark:text-slate-200">
                      {project.status}
                    </Badge>
                    <span className="text-xs text-slate-400 dark:text-slate-300">
                      {format(new Date(project.updatedAt), 'MMM dd')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
