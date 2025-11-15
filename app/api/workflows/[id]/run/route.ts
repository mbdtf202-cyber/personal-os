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

    const run = await prisma.workflowRun.create({
      data: {
        workflowId: params.id,
        status: 'RUNNING',
        logs: JSON.stringify([
          { timestamp: new Date(), message: 'Workflow started' },
        ]),
      },
    })

    await prisma.workflow.update({
      where: { id: params.id },
      data: {
        lastRunAt: new Date(),
        runCount: { increment: 1 },
      },
    })

    setTimeout(async () => {
      await prisma.workflowRun.update({
        where: { id: run.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          logs: JSON.stringify([
            { timestamp: new Date(), message: 'Workflow started' },
            { timestamp: new Date(), message: 'Workflow completed successfully' },
          ]),
        },
      })
    }, 2000)

    return NextResponse.json(run)
  } catch (error) {
    console.error('Failed to run workflow:', error)
    return NextResponse.json(
      { error: 'Failed to run workflow' },
      { status: 500 }
    )
  }
}
