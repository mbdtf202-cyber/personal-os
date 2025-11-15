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
    const filters = typeParam ? { type: typeParam.split(',') } : undefined
    
    const results = await searchService.globalSearch(userId, query, filters)
    
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
