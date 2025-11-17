'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Pin, PinOff, Edit3, Trash2, Save, X } from 'lucide-react'
import type { QuickNoteDTO } from './types'

interface QuickNoteCardProps {
  note: QuickNoteDTO
  onUpdate: (id: string, data: Partial<Pick<QuickNoteDTO, 'title' | 'content' | 'isPinned'>>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function QuickNoteCard({ note, onUpdate, onDelete }: QuickNoteCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(note.title ?? '')
  const [content, setContent] = useState(note.content)
  const [saving, setSaving] = useState(false)

  const updatedAt = new Date(note.updatedAt)
  const formattedTime = updatedAt.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const handlePinToggle = async () => {
    try {
      await onUpdate(note.id, { isPinned: !note.isPinned })
    } catch {
      // handled upstream
    }
  }

  const handleSave = async () => {
    if (!content.trim()) return
    setSaving(true)
    try {
      await onUpdate(note.id, {
        title: title.trim() ? title.trim() : null,
        content,
      })
      setIsEditing(false)
    } catch {
      // keep editing state for retry
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('确定删除这条随手记吗？')) return
    try {
      await onDelete(note.id)
    } catch {
      // handled upstream
    }
  }

  return (
    <Card className="h-full rounded-[1.75rem] border-white/40 bg-white/70 p-5 shadow-lg dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {isEditing ? (
            <Input
              value={title}
              maxLength={120}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="标题"
              className="rounded-2xl"
            />
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold theme-text-primary">
                {note.title || '未命名随手记'}
              </h3>
              {note.isPinned && <Badge variant="secondary">已固定</Badge>}
            </div>
          )}

          {isEditing ? (
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={5}
              className="rounded-3xl"
            />
          ) : (
            <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap dark:text-slate-200">
              {note.content}
            </p>
          )}

          <p className="text-xs text-slate-500">最近更新：{formattedTime}</p>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-2xl"
            onClick={handlePinToggle}
            title={note.isPinned ? '取消固定' : '固定'}
          >
            {note.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </Button>
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-2xl"
                onClick={handleSave}
                disabled={saving}
                title="保存"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-2xl"
                onClick={() => {
                  setIsEditing(false)
                  setTitle(note.title ?? '')
                  setContent(note.content)
                }}
                title="取消"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-2xl"
              onClick={() => setIsEditing(true)}
              title="编辑"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-2xl text-rose-500"
            onClick={handleDelete}
            title="删除"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
