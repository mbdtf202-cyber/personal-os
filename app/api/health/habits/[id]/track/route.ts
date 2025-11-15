import { NextResponse } from 'next/server'
import { healthService } from '@/lib/services/health'
import { requireApiAuth, UnauthorizedError } from '@/lib/auth'
import { logger } from '@/lib/logger'

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await requireApiAuth()
    const { id } = context.params
    const body = await request.json()
    const { date } = body
    
    const tracking = await healthService.trackHabit(id, new Date(date))
    
    return NextResponse.json(tracking, { status: 201 })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.error('Failed to track habit', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
