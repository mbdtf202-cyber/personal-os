import { NextResponse } from 'next/server'
import { blogService } from '@/lib/services/blog'
import { requireAuth } from '@/lib/auth'
import { updatePostSchema } from '@/lib/validations/blog'
import { z } from 'zod'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth()
    const { id } = await context.params
    const post = await blogService.getPostById(id, userId)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(post)
  } catch (error) {
    console.error('Failed to get blog post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth()
    const { id } = await context.params
    const body = await request.json()
    const validated = updatePostSchema.parse(body)
    
    const post = await blogService.updatePost(id, userId, validated)
    
    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Failed to update blog post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth()
    const { id } = await context.params
    
    await blogService.deletePost(id, userId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete blog post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
