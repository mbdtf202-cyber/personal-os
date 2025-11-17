import { requirePageAuth } from '@/lib/auth'
import { quickNotesService } from '@/lib/services/quick-notes'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { QuickNotesBoard } from '@/components/quick-notes/quick-notes-board'
import type { QuickNoteDTO } from '@/components/quick-notes/types'

export default async function QuickNotesPage() {
  const { id: userId } = await requirePageAuth()
  const notes = await quickNotesService.getNotes(userId)
  const serializedNotes: QuickNoteDTO[] = notes.map((note) => ({
    id: note.id,
    title: note.title,
    content: note.content,
    isPinned: note.isPinned,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-8">
      <PageHeader
        title="随手记"
        description="随时记录灵感、碎片想法与待办，以最小摩擦保持信息流动。"
        accent="sunset"
      />

      <PageSection
        title="灵感收集箱"
        description="顶部输入框支持快速写入，亦可搜索、编辑或固定关键内容"
      >
        <QuickNotesBoard initialNotes={serializedNotes} />
      </PageSection>
    </div>
  )
}
