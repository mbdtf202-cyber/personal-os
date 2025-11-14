'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Post {
  id: string
  title: string
  contentMarkdown: string | null
  category: string
  status: string
}

interface BlogEditorProps {
  post: Post
}

const categories = [
  'Technology',
  'Programming',
  'Design',
  'Business',
  'Personal',
  'Tutorial',
  'Review',
  'Other',
]

export function BlogEditor({ post }: BlogEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: post.title,
    contentMarkdown: post.contentMarkdown || '',
    category: post.category,
    status: post.status,
  })

  async function handleSave(newStatus?: string) {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/blog/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: newStatus || formData.status,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save post')
      }

      toast.success(
        newStatus === 'PUBLISHED' ? 'Post published!' : 'Post saved!'
      )
      
      if (newStatus === 'PUBLISHED') {
        router.push(`/blog/${post.id}`)
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to save post:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to save post'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-2xl">
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Post title..."
              className="text-2xl font-bold border-none px-0 focus-visible:ring-0"
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => handleSave()}
              disabled={isLoading}
            >
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave('PUBLISHED')}
              disabled={isLoading}
            >
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="write" className="h-full flex flex-col">
          <TabsList className="mx-6 mt-4">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="write" className="flex-1 px-6 pb-6 mt-4">
            <Textarea
              value={formData.contentMarkdown}
              onChange={(e) =>
                setFormData({ ...formData, contentMarkdown: e.target.value })
              }
              placeholder="Write your post content in Markdown..."
              className="h-full resize-none font-mono"
              disabled={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="preview" className="flex-1 px-6 pb-6 mt-4 overflow-auto">
            <div className="prose prose-slate max-w-none">
              {formData.contentMarkdown ? (
                <div className="whitespace-pre-wrap">
                  {formData.contentMarkdown}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Nothing to preview yet. Start writing in the Write tab.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
