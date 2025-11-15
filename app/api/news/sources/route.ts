import { NextResponse } from 'next/server'
import { newsService } from '@/lib/services/news'
import { requireApiAuth, UnauthorizedError } from '@/lib/auth'
import { newsSourceSchema } from '@/lib/validations/news'
import { z } from 'zod'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  try {
    const userId = await requireApiAuth()
    const sources = await newsService.getNewsSources(userId)
    
    return NextResponse.json({ sources, total: sources.length })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.error('Failed to get news sources', {
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
    const validated = newsSourceSchema.parse(body)
    
    const source = await newsService.createNewsSource(userId, validated)
    
    return NextResponse.json(source, { status: 201 })
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

    logger.error('Failed to create news source', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
