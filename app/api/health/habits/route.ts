import { NextResponse } from 'next/server'
import { healthService } from '@/lib/services/health'
import { requireApiAuth, UnauthorizedError } from '@/lib/auth'
import { habitSchema } from '@/lib/validations/health'
import { z } from 'zod'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  try {
    const userId = await requireApiAuth()
    const habits = await healthService.getHabits(userId)
    
    return NextResponse.json({ habits, total: habits.length })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.error('Failed to get habits', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireApiAuth()
    const body = await request.json()
    const validated = habitSchema.parse(body)
    
    const habit = await healthService.createHabit(userId, validated)
    
    return NextResponse.json(habit, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.error('Failed to create habit', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
