import { NextResponse } from 'next/server'
import { blogService } from '@/lib/services/blog'
import { requireApiAuth, UnauthorizedError } from '@/lib/auth'
import { updatePostSchema } from '@/lib/validations/blog'
import { z } from 'zod'
import { logger } from '@/lib/logger'

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const userId = await requireApiAuth()
    const { id } = context.params
    const post = await blogService.getPostById(id, userId)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.error('Failed to get blog post', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const userId = await requireApiAuth()
    const { id } = context.params
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
    
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.error('Failed to update blog post', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const userId = await requireApiAuth()
    const { id } = context.params
    
    await blogService.deletePost(id, userId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.error('Failed to delete blog post', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
