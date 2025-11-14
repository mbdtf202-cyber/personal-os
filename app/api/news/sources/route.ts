import { NextResponse } from 'next/server'
import { newsService } from '@/lib/services/news'
import { requireAuth } from '@/lib/auth'
import { newsSourceSchema } from '@/lib/validations/news'
import { z } from 'zod'

export async function GET(request: Request) {
  try {
    const userId = await requireAuth()
    const sources = await newsService.getNewsSources(userId)
    
    return NextResponse.json({ sources, total: sources.length })
  } catch (error) {
    console.error('Failed to get news sources:', error)
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
    
    console.error('Failed to create news source:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
