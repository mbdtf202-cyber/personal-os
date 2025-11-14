'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

export function CreateBookmarkDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchingPreview, setFetchingPreview] = useState(false)
  const [previewData, setPreviewData] = useState<any>(null)

  const handleUrlBlur = async (url: string) => {
    if (!url || previewData) return

    setFetchingPreview(true)
    try {
      const response = await fetch('/api/link-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (response.ok) {
        const data = await response.json()
        setPreviewData(data)
        toast.success('Preview fetched!')
      }
    } catch (error) {
      console.error('Failed to fetch preview:', error)
    } finally {
      setFetchingPreview(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      url: formData.get('url') as string,
      title: formData.get('title') as string || previewData?.title,
      description: formData.get('description') as string || previewData?.description || undefined,
      category: formData.get('category') as string,
      status: formData.get('status') as string,
      ...(previewData && {
        siteName: previewData.siteName,
        domain: previewData.domain,
        faviconUrl: previewData.faviconUrl,
        imageUrl: previewData.image,
        type: previewData.type,
      }),
    }

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Bookmark added!')
        setOpen(false)
        e.currentTarget.reset()
        setPreviewData(null)
        window.location.reload()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to add bookmark')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Bookmark
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Bookmark</DialogTitle>
          <DialogDescription>
            Save a useful resource or link
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              type="url"
              placeholder="https://..."
              onBlur={(e) => handleUrlBlur(e.target.value)}
              required
            />
            {fetchingPreview && (
              <p className="text-xs text-muted-foreground">Fetching preview...</p>
            )}
          </div>

          {previewData && (
            <div className="p-3 bg-secondary rounded-lg">
              <div className="flex items-start gap-3">
                {previewData.faviconUrl && (
                  <img src={previewData.faviconUrl} alt="" className="w-5 h-5 mt-1" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium line-clamp-1">{previewData.title}</p>
                  {previewData.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {previewData.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{previewData.siteName}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder={previewData?.title || "Resource title"}
              defaultValue={previewData?.title}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ARTICLE">📄 Article</SelectItem>
                  <SelectItem value="VIDEO">🎥 Video</SelectItem>
                  <SelectItem value="TOOL">🔧 Tool</SelectItem>
                  <SelectItem value="DOCUMENTATION">📚 Documentation</SelectItem>
                  <SelectItem value="INSPIRATION">💡 Inspiration</SelectItem>
                  <SelectItem value="OTHER">📌 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue="TO_READ" required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TO_READ">📖 To Read</SelectItem>
                  <SelectItem value="READING">👀 Reading</SelectItem>
                  <SelectItem value="DONE">✅ Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Bookmark'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
