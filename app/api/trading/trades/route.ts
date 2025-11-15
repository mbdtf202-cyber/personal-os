import { NextResponse } from 'next/server'
import { tradingService } from '@/lib/services/trading'
import { requireApiAuth, UnauthorizedError } from '@/lib/auth'
import { tradeSchema } from '@/lib/validations/trading'
import { logger } from '@/lib/logger'
import { z } from 'zod'

export async function GET(request: Request) {
  try {
    const userId = await requireApiAuth()
    const { searchParams } = new URL(request.url)

    const filters = {
      market: searchParams.get('market') || undefined,
      startDate: searchParams.get('startDate')
        ? new Date(searchParams.get('startDate')!)
        : undefined,
      endDate: searchParams.get('endDate')
        ? new Date(searchParams.get('endDate')!)
        : undefined,
    }

    const trades = await tradingService.getTrades(userId, filters)

    return NextResponse.json({ trades, total: trades.length })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.error('Failed to get trades', {
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
    const validated = tradeSchema.parse(body)

    const trade = await tradingService.createTrade(userId, validated)

    return NextResponse.json(trade, { status: 201 })
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

    logger.error('Failed to create trade', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
