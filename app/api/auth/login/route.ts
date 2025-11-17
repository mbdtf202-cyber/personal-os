import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import {
  attachSessionCookie,
  createSession,
  verifyPassword,
} from '@/lib/auth'
import { logger } from '@/lib/logger'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isValid = verifyPassword(password, user.passwordHash)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const { token, expiresAt } = await createSession(user.id)
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        timezone: user.timezone,
        role: user.role,
      },
    })

    attachSessionCookie(response, token, expiresAt)

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    logger.error('Failed to login user', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
