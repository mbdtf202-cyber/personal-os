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
  AlertCircle
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
      posts: any[]
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Health</CardTitle>
            <Heart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                {overview.health.hasLog ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Logged today</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Not logged yet</span>
                  </div>
                )}
                {overview.health.pendingHabits > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {overview.health.pendingHabits} habits pending
                  </p>
                )}
              </div>
              <Link href="/health">
                <Button variant="ghost" size="sm">View</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Blog</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{overview.blog.draftCount}</div>
                <p className="text-xs text-gray-500">Drafts</p>
              </div>
              <Link href="/blog">
                <Button variant="ghost" size="sm">View</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">News</CardTitle>
            <Newspaper className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{overview.news.unreadCount}</div>
                <p className="text-xs text-gray-500">Unread</p>
              </div>
              <Link href="/news">
                <Button variant="ghost" size="sm">View</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Social</CardTitle>
            <Share2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{overview.social.scheduledToday}</div>
                <p className="text-xs text-gray-500">Scheduled today</p>
              </div>
              <Link href="/social">
                <Button variant="ghost" size="sm">View</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Trading</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{overview.trading.tradesCount}</div>
                <p className="text-xs text-gray-500">Trades today</p>
              </div>
              <Link href="/trading">
                <Button variant="ghost" size="sm">View</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{overview.projects.activeCount}</div>
                <p className="text-xs text-gray-500">Active</p>
              </div>
              <Link href="/projects">
                <Button variant="ghost" size="sm">View</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
            <Bookmark className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{overview.bookmarks.toReadCount}</div>
                <p className="text-xs text-gray-500">To read</p>
              </div>
              <Link href="/bookmarks">
                <Button variant="ghost" size="sm">View</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {overview.social.scheduledToday > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Posts Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overview.social.posts.map((post: any) => (
                <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{post.platform}</Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(post.plannedPublishTime).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <Link href="/social">
                    <Button variant="ghost" size="sm">View</Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
