import { requireAuth } from '@/lib/auth'
import { socialService } from '@/lib/services/social'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function SocialPage() {
  const userId = await requireAuth()
  const posts = await socialService.getSocialPosts(userId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Social Media</h1>
          <p className="text-gray-600 mt-1">Manage your social media content</p>
        </div>
        <Button>New Post</Button>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-gray-500">No social posts yet. Create your first post!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <div key={post.id} className="rounded-lg border bg-white p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <Badge>{post.status}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{post.platform}</p>
              <p className="text-sm line-clamp-3">{post.contentText}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
