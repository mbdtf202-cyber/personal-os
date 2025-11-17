import { requirePageAuth } from '@/lib/auth'
import { blogService } from '@/lib/services/blog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { GlassCard } from '@/components/ui/glass-card'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function BlogPage() {
  const { id: userId } = await requirePageAuth()
  const posts = await blogService.getPosts(userId)

  return (
    <div className="space-y-8">
      <PageHeader
        title="写作工作台"
        description="以 iOS 质感管理创作节奏，所有文章在这里实时同步。"
        accent="lavender"
        actions={(
          <Link href="/blog/new">
            <Button className="theme-btn-primary">新文章</Button>
          </Link>
        )}
      />

      <PageSection title="文章列表" description="最近的创作与状态">
        {posts.length === 0 ? (
          <div className="py-12 text-center theme-text-secondary">
            还没有文章，马上开始创作吧。
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 rounded-[1.75rem]"
              >
                <GlassCard className="p-5 hover:-translate-y-0.5 transition-transform">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.3em] theme-text-tertiary">
                        {post.category}
                      </p>
                      <h3 className="text-xl font-semibold theme-text-primary">{post.title}</h3>
                      <p className="text-sm theme-text-secondary">
                        {format(new Date(post.createdAt), 'yyyy-MM-dd')} · {post.category}
                      </p>
                    </div>
                    <Badge
                      variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'}
                      className="rounded-full px-4"
                    >
                      {post.status}
                    </Badge>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        )}
      </PageSection>
    </div>
  )
}
