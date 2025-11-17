import { NextResponse } from 'next/server'
import { cache } from '@/lib/cache'
import { requireAdmin, UnauthorizedError } from '@/lib/auth'

export async function POST() {
  try {
    await requireAdmin()
    cache.clear()

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    console.error('Cache clear failed:', error)
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    )
  }
}
