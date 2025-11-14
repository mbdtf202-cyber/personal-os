import { NextResponse } from 'next/server'
import { healthService } from '@/lib/services/health'
import { requireAuth } from '@/lib/auth'

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await context.params
    const body = await request.json()
    const { date } = body
    
    const tracking = await healthService.trackHabit(id, new Date(date))
    
    return NextResponse.json(tracking, { status: 201 })
  } catch (error) {
    console.error('Failed to track habit:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
