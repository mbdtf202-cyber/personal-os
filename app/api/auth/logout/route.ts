import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { clearSessionCookie, invalidateSession } from '@/lib/auth'
import { logger } from '@/lib/logger'

export async function POST() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('pos_session')?.value ?? null

    if (token) {
      await invalidateSession(token)
    }

    const response = NextResponse.json({ success: true })
    clearSessionCookie(response)

    return response
  } catch (error) {
    logger.error('Failed to sign out user', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
