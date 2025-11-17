import { NextResponse } from 'next/server'
import { bookmarksService } from '@/lib/services/bookmarks'
import { logger } from '@/lib/logger'
import { requireApiAuth, UnauthorizedError } from '@/lib/auth'

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const userId = await requireApiAuth()
    const { id } = context.params
    const bookmark = await bookmarksService.recordVisit(id, userId)

    return NextResponse.json(bookmark)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    logger.error('Failed to record bookmark visit', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
