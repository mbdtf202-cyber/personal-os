import { NextResponse } from 'next/server'
import { healthService } from '@/lib/services/health'
import { requireAuth } from '@/lib/auth'
import { habitSchema } from '@/lib/validations/health'
import { z } from 'zod'

export async function GET(request: Request) {
  try {
    const userId = await requireAuth()
    const habits = await healthService.getHabits(userId)
    
    return NextResponse.json({ habits, total: habits.length })
  } catch (error) {
    console.error('Failed to get habits:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireAuth()
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
    
    console.error('Failed to create habit:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
