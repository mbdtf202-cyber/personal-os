import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { cache } from '@/lib/cache'

export async function POST() {
  try {
    await requireAuth()
    cache.clear()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cache clear failed:', error)
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    )
  }
}
