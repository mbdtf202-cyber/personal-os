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
          <CardTitle className="text-lg">Recent Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {activity.posts.length === 0 ? (
            <p className="text-sm text-gray-500">No recent posts</p>
          ) : (
            <div className="space-y-3">
              {activity.posts.slice(0, 5).map((post) => (
                <div key={post.id} className="border-b pb-2 last:border-0">
                  <Link href={`/blog/${post.id}`} className="text-sm font-medium hover:underline">
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{post.status}</Badge>
                    <span className="text-xs text-gray-500">
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
          <CardTitle className="text-lg">Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          {activity.trades.length === 0 ? (
            <p className="text-sm text-gray-500">No recent trades</p>
          ) : (
            <div className="space-y-3">
              {activity.trades.slice(0, 5).map((trade) => (
                <div key={trade.id} className="border-b pb-2 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{trade.symbol}</span>
                    <span className={`text-sm font-semibold ${
                      Number(trade.pnl) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${Number(trade.pnl) >= 0 ? '+' : ''}{Number(trade.pnl).toFixed(2)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
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
          <CardTitle className="text-lg">Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {activity.projects.length === 0 ? (
            <p className="text-sm text-gray-500">No active projects</p>
          ) : (
            <div className="space-y-3">
              {activity.projects.slice(0, 5).map((project) => (
                <div key={project.id} className="border-b pb-2 last:border-0">
                  <Link href={`/projects`} className="text-sm font-medium hover:underline">
                    {project.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{project.status}</Badge>
                    <span className="text-xs text-gray-500">
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
