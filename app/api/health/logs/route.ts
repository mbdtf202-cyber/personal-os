import { NextResponse } from 'next/server'
import { healthService } from '@/lib/services/health'
import { requireApiAuth, UnauthorizedError } from '@/lib/auth'
import { healthLogSchema } from '@/lib/validations/health'
import { logger } from '@/lib/logger'
import { z } from 'zod'

export async function GET(request: Request) {
  try {
    const userId = await requireApiAuth()
    const { searchParams } = new URL(request.url)

    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : new Date()

    const logs = await healthService.getHealthLogs(userId, startDate, endDate)

    return NextResponse.json({ logs, total: logs.length })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.error('Failed to get health logs', {
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
    const validated = healthLogSchema.parse(body)

    const log = await healthService.createHealthLog(userId, validated)

    return NextResponse.json(log, { status: 201 })
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

    logger.error('Failed to create health log', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
