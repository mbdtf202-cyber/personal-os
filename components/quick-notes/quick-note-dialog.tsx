'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import type { QuickNoteDTO } from './types'

interface QuickNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (note: QuickNoteDTO) => void
}

export function QuickNoteDialog({ open, onOpenChange, onSuccess }: QuickNoteDialogProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!content.trim()) {
      toast.error('内容不能为空')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/quick-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() ? title.trim() : undefined,
          content: content.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create note')
      }

      const note: QuickNoteDTO = await response.json()
      toast.success('已保存到随手记')
      setTitle('')
      setContent('')
      onSuccess?.(note)
      onOpenChange(false)
    } catch (error) {
      console.error(error)
      toast.error('保存失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>快速记一条</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="标题 (可选)"
            maxLength={120}
            className="rounded-2xl"
          />
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="输入内容..."
            rows={5}
            maxLength={2000}
            className="rounded-3xl"
          />
          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
