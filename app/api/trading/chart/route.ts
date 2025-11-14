import { NextResponse } from 'next/server'
import { tradingService } from '@/lib/services/trading'
import { requireAuth } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const userId = await requireAuth()
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    
    const stats = await tradingService.getTradeStatistics(userId, days)
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to get trading stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
