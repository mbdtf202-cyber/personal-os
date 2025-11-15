import { NextResponse } from 'next/server'
import { socialService } from '@/lib/services/social'
import { requireApiAuth, UnauthorizedError } from '@/lib/auth'
import { socialPostSchema } from '@/lib/validations/social'
import { z } from 'zod'
import { logger } from '@/lib/logger'

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const userId = await requireApiAuth()
    const { id } = context.params
    const body = await request.json()
    const validated = socialPostSchema.partial().parse(body)
    
    const post = await socialService.updateSocialPost(id, userId, validated)
    
    return NextResponse.json(post)
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

    logger.error('Failed to update social post', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
