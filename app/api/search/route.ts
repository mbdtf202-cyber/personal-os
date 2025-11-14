import { NextResponse } from 'next/server'
import { searchService } from '@/lib/services/search'
import { requireAuth } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const userId = await requireAuth()
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
    console.error('Search failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
