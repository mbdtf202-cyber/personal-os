import { requireAuth } from '@/lib/auth'
import { blogService } from '@/lib/services/blog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function BlogPage() {
  const userId = await requireAuth()
  const posts = await blogService.getPosts(userId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-gray-600 mt-1">Write and manage your blog posts</p>
        </div>
        <Link href="/blog/new">
          <Button>New Post</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="rounded-lg border bg-white p-8 text-center">
            <p className="text-gray-500">No posts yet. Create your first post!</p>
          </div>
        ) : (
          posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <div className="rounded-lg border bg-white p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                      <span>•</span>
                      <span>{post.category}</span>
                    </div>
                  </div>
                  <Badge variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                    {post.status}
                  </Badge>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
