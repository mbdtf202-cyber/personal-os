import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth'
import { handleApiError, validateRequest } from '@/lib/api-error'
import { updateQuickNoteSchema } from '@/lib/validations/quick-note'

const serialize = (note: any) => ({
  ...note,
  createdAt: note.createdAt.toISOString(),
  updatedAt: note.updatedAt.toISOString(),
})

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireApiAuth()
    const note = await prisma.quickNote.findFirst({ where: { id: params.id, userId } })

    if (!note) {
      return NextResponse.json({ error: 'Quick note not found' }, { status: 404 })
    }

    const body = await request.json()
    const payload = validateRequest(body, updateQuickNoteSchema)

    const updated = await prisma.quickNote.update({
      where: { id: note.id },
      data: {
        ...(payload.title !== undefined && { title: payload.title ?? null }),
        ...(payload.content !== undefined && { content: payload.content.trim() }),
        ...(payload.isPinned !== undefined && { isPinned: payload.isPinned }),
      },
    })

    return NextResponse.json(serialize(updated))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireApiAuth()
    const note = await prisma.quickNote.findFirst({ where: { id: params.id, userId } })

    if (!note) {
      return NextResponse.json({ error: 'Quick note not found' }, { status: 404 })
    }

    await prisma.quickNote.delete({ where: { id: note.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
