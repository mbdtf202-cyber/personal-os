import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT_USER_ID = 'local-user'

export async function GET(request: NextRequest) {
  try {
    const workflows = await prisma.workflow.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { runs: true },
        },
      },
    })

    return NextResponse.json(workflows)
  } catch (error) {
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
    const { name, description, steps, trigger, schedule } = body

    const workflow = await prisma.workflow.create({
      data: {
        userId: DEFAULT_USER_ID,
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
    console.error('Failed to create workflow:', error)
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    )
  }
}
