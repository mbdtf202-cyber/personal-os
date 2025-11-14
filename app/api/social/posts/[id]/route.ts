import { NextResponse } from 'next/server'
import { socialService } from '@/lib/services/social'
import { requireAuth } from '@/lib/auth'
import { socialPostSchema } from '@/lib/validations/social'
import { z } from 'zod'

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth()
    const { id } = await context.params
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
    
    console.error('Failed to update social post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
