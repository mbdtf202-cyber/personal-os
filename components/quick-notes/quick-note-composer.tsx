'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import type { QuickNoteDTO } from './types'

interface QuickNoteComposerProps {
  onCreated?: (note: QuickNoteDTO) => void
}

export function QuickNoteComposer({ onCreated }: QuickNoteComposerProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!content.trim()) {
      toast.error('请填写内容')
      return
    }

    setSubmitting(true)
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
        throw new Error('Failed to save quick note')
      }

      const note: QuickNoteDTO = await response.json()
      toast.success('已保存到随手记')
      setTitle('')
      setContent('')
      onCreated?.(note)
    } catch (error) {
      console.error(error)
      toast.error('保存失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-[1.5rem] bg-white/70 p-5 shadow-inner dark:bg-white/5">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="给随手记起个标题 (可选)"
          maxLength={120}
          className="rounded-2xl bg-white/80 dark:bg-white/10"
        />
        <Button
          type="submit"
          disabled={submitting}
          className="rounded-2xl bg-slate-900 text-white shadow-lg hover:bg-slate-800 dark:bg-white dark:text-slate-900"
        >
          {submitting ? '保存中...' : '记录'}
        </Button>
      </div>
      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="此刻的灵感 / 待办 / 观察..."
        rows={3}
        maxLength={2000}
        className="min-h-[120px] rounded-3xl border border-slate-200/70 bg-white/80 text-base dark:border-white/10 dark:bg-white/5"
      />
    </form>
  )
}
