// API 错误处理
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { UnauthorizedError } from '@/lib/auth'

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }

  if (error instanceof UnauthorizedError) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    )
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error.errors,
      },
      { status: 400 }
    )
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    )
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}

export function validateRequest(data: unknown, schema: any) {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ApiError(400, 'Validation failed', 'VALIDATION_ERROR')
    }
    throw error
  }
}
