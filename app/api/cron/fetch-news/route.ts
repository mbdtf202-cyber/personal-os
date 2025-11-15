import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // TODO: Implement news fetching logic here
    // This would call your news service to fetch from RSS feeds
    
    return NextResponse.json({ success: true, message: 'News fetched successfully' })
  } catch (error) {
    logger.error('Failed to trigger cron news fetch', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
