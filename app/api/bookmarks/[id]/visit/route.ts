import { NextResponse } from 'next/server'
import { bookmarksService } from '@/lib/services/bookmarks'

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const bookmark = await bookmarksService.recordVisit(id)
    
    return NextResponse.json(bookmark)
  } catch (error) {
    console.error('Failed to record visit:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
