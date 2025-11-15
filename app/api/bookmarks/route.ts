import { NextResponse } from 'next/server'
import { bookmarksService } from '@/lib/services/bookmarks'
import { requireApiAuth, UnauthorizedError } from '@/lib/auth'
import { LinkPreviewError } from '@/lib/services/link-preview'
import { logger } from '@/lib/logger'
import { bookmarkSchema } from '@/lib/validations/bookmarks'
import { linkPreviewService } from '@/lib/services/link-preview'
import { z } from 'zod'

export async function GET(request: Request) {
  try {
    const userId = await requireApiAuth()
    const { searchParams } = new URL(request.url)
    
    const filters = {
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || undefined,
      type: searchParams.get('type') || undefined,
    }
    
    const bookmarks = await bookmarksService.getBookmarks(userId, filters)
    
    return NextResponse.json({ bookmarks, total: bookmarks.length })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.error('Failed to get bookmarks', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireApiAuth()
    const body = await request.json()
    
    // If URL is provided without other data, fetch preview
    if (body.url && !body.title) {
      const preview = await linkPreviewService.fetchPreview(body.url)
      body.title = preview.title
      body.description = preview.description
      body.siteName = preview.siteName
      body.domain = preview.domain
      body.faviconUrl = preview.faviconUrl
      body.imageUrl = preview.image
      body.type = preview.type
    }
    
    const validated = bookmarkSchema.parse(body)
    const bookmark = await bookmarksService.createBookmark(userId, validated)
    
    return NextResponse.json(bookmark, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    if (error instanceof LinkPreviewError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.error('Failed to create bookmark', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
