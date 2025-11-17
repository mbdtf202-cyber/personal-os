import { requirePageAuth } from '@/lib/auth'
import { socialService } from '@/lib/services/social'
import { PageHeader } from '@/components/layout/page-header'
import { SocialPostsBoard } from '@/components/social/social-posts-board'
import { CreateSocialPostDialog } from '@/components/social/create-social-post-dialog'

export default async function SocialPage() {
  const { id: userId } = await requirePageAuth()
  const posts = await socialService.getSocialPosts(userId)

  return (
    <div className="space-y-8">
      <PageHeader
        title="社媒排期"
        description="统一管理不同平台的创意、草稿与排期进度。"
        accent="mint"
        actions={<CreateSocialPostDialog />}
      />

      <SocialPostsBoard posts={posts} />
    </div>
  )
}
