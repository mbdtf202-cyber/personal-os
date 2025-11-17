import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth'
import { handleApiError, validateRequest } from '@/lib/api-error'
import { createQuickNoteSchema } from '@/lib/validations/quick-note'

const serialize = (note: any) => ({
  ...note,
  createdAt: note.createdAt.toISOString(),
  updatedAt: note.updatedAt.toISOString(),
})

export async function GET() {
  try {
    const userId = await requireApiAuth()
    const notes = await prisma.quickNote.findMany({
      where: { userId },
      orderBy: [
        { isPinned: 'desc' },
        { updatedAt: 'desc' },
      ],
    })

    return NextResponse.json(notes.map(serialize))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireApiAuth()
    const body = await request.json()
    const payload = validateRequest(body, createQuickNoteSchema)

    const note = await prisma.quickNote.create({
      data: {
        userId,
        title: payload.title ?? null,
        content: payload.content.trim(),
        isPinned: payload.isPinned ?? false,
      },
    })

    return NextResponse.json(serialize(note), { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
