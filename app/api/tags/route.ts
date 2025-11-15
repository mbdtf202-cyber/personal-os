import { NextResponse } from 'next/server'
import { tagService } from '@/lib/services/tags'
import { requireApiAuth, UnauthorizedError } from '@/lib/auth'
import { z } from 'zod'
import { logger } from '@/lib/logger'

const tagSchema = z.object({
  name: z.string().min(1).max(50),
  type: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    await requireApiAuth()
    const tags = await tagService.getTags()
    
    return NextResponse.json({ tags })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.error('Failed to get tags', {
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
    await requireApiAuth()
    const body = await request.json()
    const validated = tagSchema.parse(body)
    
    const tag = await tagService.createTag(validated.name, validated.type || 'GENERAL')
    
    return NextResponse.json(tag, { status: 201 })
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

    logger.error('Failed to create tag', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
