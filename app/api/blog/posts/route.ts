import { NextResponse } from 'next/server'
import { blogService } from '@/lib/services/blog'
import { requireAuth } from '@/lib/auth'
import { createPostSchema } from '@/lib/validations/blog'
import { z } from 'zod'

export async function GET(request: Request) {
  try {
    const userId = await requireAuth()
    const { searchParams } = new URL(request.url)
    
    const filters = {
      status: searchParams.get('status') || undefined,
      category: searchParams.get('category') || undefined,
    }
    
    const posts = await blogService.getPosts(userId, filters)
    
    return NextResponse.json({ posts, total: posts.length })
  } catch (error) {
    console.error('Failed to get blog posts:', error)
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
    
    // Step 1: Create post with title and metadata only
    const validated = createPostSchema.parse(body)
    
    const post = await blogService.createPost(userId, {
      ...validated,
      contentMarkdown: '', // Empty content initially
      status: 'DRAFT',
    })
    
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Failed to create blog post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
