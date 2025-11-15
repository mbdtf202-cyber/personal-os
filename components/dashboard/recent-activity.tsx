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
      <Card className="theme-bg-secondary theme-border" style={{ borderWidth: '1px' }}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold theme-text-secondary">
            Recent Blog Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.posts.length === 0 ? (
            <p className="rounded-2xl theme-border theme-bg-tertiary p-6 text-sm theme-text-tertiary backdrop-blur-sm" style={{ borderWidth: '1px', borderStyle: 'dashed' }}>
              No recent posts
            </p>
          ) : (
            <div className="space-y-3">
              {activity.posts.slice(0, 5).map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl theme-border theme-bg-secondary p-4 theme-shadow-sm transition hover:-translate-y-0.5"
                  style={{ borderWidth: '1px' }}
                >
                  <Link href={`/blog/${post.id}`} className="text-sm font-medium theme-text-primary hover:theme-color-primary">
                    {post.title}
                  </Link>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="rounded-full theme-border px-2 text-xs theme-text-secondary" style={{ borderWidth: '1px' }}>
                      {post.status}
                    </Badge>
                    <span className="text-xs theme-text-tertiary">
                      {format(new Date(post.updatedAt), 'MMM dd')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="theme-bg-secondary theme-border" style={{ borderWidth: '1px' }}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold theme-text-secondary">
            Recent Trades
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.trades.length === 0 ? (
            <p className="rounded-2xl theme-border theme-bg-tertiary p-6 text-sm theme-text-tertiary backdrop-blur-sm" style={{ borderWidth: '1px', borderStyle: 'dashed' }}>
              No recent trades
            </p>
          ) : (
            <div className="space-y-3">
              {activity.trades.slice(0, 5).map((trade) => (
                <div
                  key={trade.id}
                  className="rounded-2xl theme-border theme-bg-secondary p-4 theme-shadow-sm transition hover:-translate-y-0.5"
                  style={{ borderWidth: '1px' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium theme-text-primary">{trade.symbol}</span>
                    <span
                      className={
                        Number(trade.pnl) >= 0
                          ? 'text-sm font-semibold theme-color-success'
                          : 'text-sm font-semibold theme-color-danger'
                      }
                    >
                      ${Number(trade.pnl) >= 0 ? '+' : ''}{Number(trade.pnl).toFixed(2)}
                    </span>
                  </div>
                  <span className="text-xs theme-text-tertiary">
                    {format(new Date(trade.date), 'MMM dd')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="theme-bg-secondary theme-border" style={{ borderWidth: '1px' }}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold theme-text-secondary">
            Active Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.projects.length === 0 ? (
            <p className="rounded-2xl theme-border theme-bg-tertiary p-6 text-sm theme-text-tertiary backdrop-blur-sm" style={{ borderWidth: '1px', borderStyle: 'dashed' }}>
              No active projects
            </p>
          ) : (
            <div className="space-y-3">
              {activity.projects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl theme-border theme-bg-secondary p-4 theme-shadow-sm transition hover:-translate-y-0.5"
                  style={{ borderWidth: '1px' }}
                >
                  <Link href={`/projects`} className="text-sm font-medium theme-text-primary hover:theme-color-primary">
                    {project.title}
                  </Link>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="rounded-full theme-border px-2 text-xs theme-text-secondary" style={{ borderWidth: '1px' }}>
                      {project.status}
                    </Badge>
                    <span className="text-xs theme-text-tertiary">
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
