import { NextResponse } from 'next/server'
import { tradingService } from '@/lib/services/trading'
import { requireAuth } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const userId = await requireAuth()
    const { searchParams } = new URL(request.url)
    
    const filters = {
      market: searchParams.get('market') || undefined,
      startDate: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined,
      endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined,
    }
    
    const trades = await tradingService.getTrades(userId, filters)
    
    return NextResponse.json({ trades, total: trades.length })
  } catch (error) {
    console.error('Failed to get trades:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
