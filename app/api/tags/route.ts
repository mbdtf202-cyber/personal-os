import { NextResponse } from 'next/server'
import { tagService } from '@/lib/services/tags'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const tagSchema = z.object({
  name: z.string().min(1).max(50),
  type: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    await requireAuth()
    const tags = await tagService.getTags()
    
    return NextResponse.json({ tags })
  } catch (error) {
    console.error('Failed to get tags:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth()
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
    
    console.error('Failed to create tag:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
