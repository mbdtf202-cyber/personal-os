import { requirePageAuth } from '@/lib/auth'
import { blogService } from '@/lib/services/blog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = await requirePageAuth()
  const { id } = await params
  const post = await blogService.getPostById(id, userId)

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/blog">
          <Button variant="outline">← Back</Button>
        </Link>
        <Badge variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'}>
          {post.status}
        </Badge>
      </div>

      <div className="rounded-lg border bg-white p-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <span>{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</span>
          <span>•</span>
          <span>{post.category}</span>
        </div>
        <div className="prose max-w-none">
          <pre className="whitespace-pre-wrap">{post.contentMarkdown}</pre>
        </div>
      </div>
    </div>
  )
}
