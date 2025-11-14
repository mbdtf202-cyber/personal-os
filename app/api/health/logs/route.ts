import { NextResponse } from 'next/server'
import { healthService } from '@/lib/services/health'
import { requireAuth } from '@/lib/auth'
import { healthLogSchema } from '@/lib/validations/health'
import { z } from 'zod'

export async function GET(request: Request) {
  try {
    const userId = await requireAuth()
    const { searchParams } = new URL(request.url)
    
    const startDate = searchParams.get('startDate') 
      ? new Date(searchParams.get('startDate')!) 
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = searchParams.get('endDate') 
      ? new Date(searchParams.get('endDate')!) 
      : new Date()
    
    const logs = await healthService.getHealthLogs(userId, startDate, endDate)
    
    return NextResponse.json({ logs, total: logs.length })
  } catch (error) {
    console.error('Failed to get health logs:', error)
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
    const validated = healthLogSchema.parse(body)
    
    const log = await healthService.createHealthLog(userId, validated)
    
    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Failed to create health log:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
