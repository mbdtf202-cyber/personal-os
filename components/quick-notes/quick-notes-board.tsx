'use client'

import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { QuickNoteCard } from './quick-note-card'
import { QuickNoteComposer } from './quick-note-composer'
import type { QuickNoteDTO } from './types'

interface QuickNotesBoardProps {
  initialNotes: QuickNoteDTO[]
}

export function QuickNotesBoard({ initialNotes }: QuickNotesBoardProps) {
  const [notes, setNotes] = useState<QuickNoteDTO[]>(initialNotes)
  const [keyword, setKeyword] = useState('')
  const normalizedKeyword = keyword.trim().toLowerCase()

  const filteredNotes = useMemo(() => {
    if (!normalizedKeyword) return notes
    return notes.filter((note) => {
      const title = note.title?.toLowerCase() ?? ''
      return (
        title.includes(normalizedKeyword) ||
        note.content.toLowerCase().includes(normalizedKeyword)
      )
    })
  }, [notes, normalizedKeyword])

  const pinned = filteredNotes.filter((note) => note.isPinned)
  const others = filteredNotes.filter((note) => !note.isPinned)

  const handleCreated = (note: QuickNoteDTO) => {
    setNotes((prev) => [note, ...prev])
  }

  const handleUpdate = async (
    id: string,
    data: Partial<Pick<QuickNoteDTO, 'title' | 'content' | 'isPinned'>>,
  ) => {
    try {
      const response = await fetch(`/api/quick-notes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update note')
      }

      const updated: QuickNoteDTO = await response.json()
      setNotes((prev) => prev.map((note) => (note.id === id ? updated : note)))
      toast.success('随手记已更新')
    } catch (error) {
      console.error(error)
      toast.error('更新失败，请稍后再试')
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    const previous = notes
    setNotes((prev) => prev.filter((note) => note.id !== id))
    try {
      const response = await fetch(`/api/quick-notes/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('Failed to delete note')
      }
      toast.success('已删除')
    } catch (error) {
      console.error(error)
      setNotes(previous)
      toast.error('删除失败，请稍后再试')
    }
  }

  return (
    <div className="space-y-6">
      <QuickNoteComposer onCreated={handleCreated} />

      <div className="rounded-3xl bg-white/60 p-5 dark:bg-white/5">
        <Input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="搜索标题或内容"
          className="rounded-2xl bg-white/80 dark:bg-white/10"
        />
      </div>

      {notes.length === 0 && (
        <div className="rounded-[2rem] border border-dashed border-slate-300/70 bg-white/50 p-10 text-center text-slate-500 dark:border-white/10 dark:bg-white/5">
          暂无记录，先写下一条灵感吧。
        </div>
      )}

      {notes.length > 0 && filteredNotes.length === 0 && (
        <div className="rounded-[2rem] border border-dashed border-slate-300/70 bg-white/40 p-10 text-center text-slate-500 dark:border-white/10 dark:bg-white/5">
          没有匹配的随手记，换个关键词试试。
        </div>
      )}

      {pinned.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              已固定
            </h3>
            <span className="text-xs text-slate-400">{pinned.length} 条</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pinned.map((note) => (
              <QuickNoteCard
                key={note.id}
                note={note}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              最近记录
            </h3>
            <span className="text-xs text-slate-400">{others.length} 条</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {others.map((note) => (
              <QuickNoteCard
                key={note.id}
                note={note}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
