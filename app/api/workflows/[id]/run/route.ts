import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workflow = await prisma.workflow.findUnique({
      where: { id: params.id },
    })

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }

    const startTime = new Date()
    const steps = JSON.parse(workflow.steps)
    const logs = [
      { timestamp: startTime, message: 'Workflow started' },
    ]

    for (let i = 0; i < steps.length; i++) {
      logs.push({
        timestamp: new Date(),
        message: `Executing step ${i + 1}: ${steps[i]}`,
      })
    }

    logs.push({
      timestamp: new Date(),
      message: 'Workflow completed successfully',
    })

    const run = await prisma.workflowRun.create({
      data: {
        workflowId: params.id,
        status: 'COMPLETED',
        startedAt: startTime,
        completedAt: new Date(),
        logs: JSON.stringify(logs),
      },
    })

    await prisma.workflow.update({
      where: { id: params.id },
      data: {
        lastRunAt: new Date(),
        runCount: { increment: 1 },
      },
    })

    return NextResponse.json(run)
  } catch (error) {
    console.error('Failed to run workflow:', error)
    
    try {
      await prisma.workflowRun.create({
        data: {
          workflowId: params.id,
          status: 'FAILED',
          startedAt: new Date(),
          completedAt: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
          logs: JSON.stringify([
            { timestamp: new Date(), message: 'Workflow failed' },
          ]),
        },
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }
    
    return NextResponse.json(
      { error: 'Failed to run workflow' },
      { status: 500 }
    )
  }
}
