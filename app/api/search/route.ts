import { NextResponse } from 'next/server'
import { searchService } from '@/lib/services/search'
import { requireApiAuth, UnauthorizedError } from '@/lib/auth'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  try {
    const userId = await requireApiAuth()
    const { searchParams } = new URL(request.url)

    const query = searchParams.get('q')
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const typeParam = searchParams.get('type')
    const requestedTypes = typeParam
      ? new Set(typeParam.split(',').map((type) => type.trim()).filter(Boolean))
      : null

    const results = await searchService.search(userId, query)

    if (requestedTypes) {
      const filtered = {
        ...results,
        blog: requestedTypes.has('blog') ? results.blog : [],
        news: requestedTypes.has('news') ? results.news : [],
        bookmarks: requestedTypes.has('bookmark') ? results.bookmarks : [],
        projects: requestedTypes.has('project') ? results.projects : [],
        training: requestedTypes.has('training') ? results.training : [],
        quickNotes: requestedTypes.has('quickNote') ? results.quickNotes : [],
      }

      filtered.total =
        filtered.blog.length +
        filtered.news.length +
        filtered.bookmarks.length +
        filtered.projects.length +
        filtered.training.length +
        filtered.quickNotes.length

      return NextResponse.json(filtered)
    }

    return NextResponse.json(results)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.error('Search failed', {
      error: error instanceof Error ? error.message : String(error),
      query: request.url,
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
