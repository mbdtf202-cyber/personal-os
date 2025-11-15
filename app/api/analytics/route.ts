import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { analyticsService } from '@/lib/services/analytics'

export async function GET() {
  try {
    const userId = await requireAuth()
    const analytics = await analyticsService.getFullAnalytics(userId)
    
    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Analytics fetch failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
