import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth, UnauthorizedError } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const userId = await requireApiAuth()
    const workflows = await prisma.workflow.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { runs: true },
        },
      },
    })

    return NextResponse.json(workflows)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error('Failed to fetch workflows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userId = await requireApiAuth()
    const { name, description, steps, trigger, schedule } = body

    const workflow = await prisma.workflow.create({
      data: {
        userId,
        name,
        description,
        steps: JSON.stringify(steps),
        trigger,
        schedule,
        status: 'DRAFT',
      },
    })

    return NextResponse.json(workflow)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error('Failed to create workflow:', error)
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    )
  }
}
