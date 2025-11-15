import { NextResponse } from 'next/server'
import { tradingService } from '@/lib/services/trading'
import { requireApiAuth, UnauthorizedError } from '@/lib/auth'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  try {
    const userId = await requireApiAuth()
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    
    const stats = await tradingService.getTradeStatistics(userId, days)
    
    return NextResponse.json(stats)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.error('Failed to get trading stats', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
