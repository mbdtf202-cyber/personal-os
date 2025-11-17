import { notFound, redirect } from 'next/navigation'
import { blogService } from '@/lib/services/blog'
import { requirePageAuth } from '@/lib/auth'
import { BlogEditor } from '@/components/blog/blog-editor'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: userId } = await requirePageAuth()
  const { id } = await params
  const post = await blogService.getPost(id)

  if (!post) {
    notFound()
  }

  // Ensure user owns this post
  if (post.userId !== userId) {
    redirect('/blog')
  }

  return (
    <div className="h-full">
      <BlogEditor post={post} />
    </div>
  )
}
