'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPost } from '@/lib/actions/blog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export function BlogPostForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title') as string,
      contentMarkdown: formData.get('content') as string,
      category: formData.get('category') as string,
      status: formData.get('status') as 'DRAFT' | 'PUBLISHED',
    }

    try {
      const result = await createPost(data)

      if (result.success) {
        toast.success('Post created!')
        router.push('/blog')
      } else {
        toast.error(result.error || 'Failed to create post')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Post title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              placeholder="e.g., Tech, Life, Trading"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content (Markdown)</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your post content in Markdown..."
              rows={15}
              required
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" name="status" value="DRAFT" disabled={loading}>
              {loading ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button type="submit" name="status" value="PUBLISHED" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
