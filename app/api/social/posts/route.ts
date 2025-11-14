import { NextResponse } from 'next/server'
import { socialService } from '@/lib/services/social'
import { requireAuth } from '@/lib/auth'
import { socialPostSchema } from '@/lib/validations/social'
import { z } from 'zod'

export async function GET(request: Request) {
  try {
    const userId = await requireAuth()
    const { searchParams } = new URL(request.url)
    
    const filters = {
      platform: searchParams.get('platform') || undefined,
      status: searchParams.get('status') || undefined,
    }
    
    const posts = await socialService.getSocialPosts(userId, filters)
    
    return NextResponse.json({ posts, total: posts.length })
  } catch (error) {
    console.error('Failed to get social posts:', error)
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
    const validated = socialPostSchema.parse(body)
    
    const post = await socialService.createSocialPost(userId, validated)
    
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Failed to create social post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
