import { NextResponse } from 'next/server'
import { requireAuth, UnauthorizedError } from '@/lib/auth'
import { analyticsService } from '@/lib/services/analytics'

export async function GET() {
  try {
    const userId = await requireAuth()
    const analytics = await analyticsService.getFullAnalytics(userId)
    
    return NextResponse.json(analytics)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error('Analytics fetch failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
