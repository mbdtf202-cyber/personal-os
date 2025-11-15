// API 中间件
import { NextRequest, NextResponse } from 'next/server'
import { logger } from './logger'
import { defaultRateLimiter } from './rate-limit'

// 日志中间件
export function withLogging(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const start = performance.now()
    const method = req.method
    const pathname = req.nextUrl.pathname

    try {
      const response = await handler(req)
      const duration = performance.now() - start

      logger.info(`${method} ${pathname}`, {
        status: response.status,
        duration: `${duration.toFixed(2)}ms`,
      })

      return response
    } catch (error) {
      const duration = performance.now() - start
      logger.error(`${method} ${pathname}`, error as Error, {
        duration: `${duration.toFixed(2)}ms`,
      })
      throw error
    }
  }
}

// 速率限制中间件
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  keyFn?: (req: NextRequest) => string
) {
  return async (req: NextRequest) => {
    const key = keyFn ? keyFn(req) : req.ip || 'unknown'

    if (!defaultRateLimiter.isAllowed(key)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    const response = await handler(req)
    const remaining = defaultRateLimiter.getRemainingRequests(key)

    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Limit', '100')

    return response
  }
}

// CORS 中间件
export function withCors(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    }

    const response = await handler(req)
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
  }
}

// 组合中间件
export function withMiddleware(
  handler: (req: NextRequest) => Promise<NextResponse>,
  middlewares: Array<(h: (req: NextRequest) => Promise<NextResponse>) => (req: NextRequest) => Promise<NextResponse>>
) {
  return middlewares.reduce((h, middleware) => middleware(h), handler)
}
