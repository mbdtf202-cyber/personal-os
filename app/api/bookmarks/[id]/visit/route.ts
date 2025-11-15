import { NextResponse } from 'next/server'
import { bookmarksService } from '@/lib/services/bookmarks'
import { logger } from '@/lib/logger'

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params
    const bookmark = await bookmarksService.recordVisit(id)

    return NextResponse.json(bookmark)
  } catch (error) {
    logger.error('Failed to record bookmark visit', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
