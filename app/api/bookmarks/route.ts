import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { handleApiError, validateRequest } from '@/lib/api-error'
import { createBookmarkSchema } from '@/lib/validations/bookmark'

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth()
    const body = await request.json()
    
    const validatedData = validateRequest(body, createBookmarkSchema)

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        url: validatedData.url,
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        status: 'TO_READ',
      },
    })

    return NextResponse.json(bookmark, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth()
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    const where: any = { userId }
    if (category) where.category = category
    if (status) where.status = status

    const bookmarks = await prisma.bookmark.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(bookmarks)
  } catch (error) {
    return handleApiError(error)
  }
}
