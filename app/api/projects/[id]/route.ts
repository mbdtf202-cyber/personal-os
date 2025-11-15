import { NextResponse } from 'next/server'
import { projectsService } from '@/lib/services/projects'
import { requireApiAuth, UnauthorizedError } from '@/lib/auth'
import { projectSchema } from '@/lib/validations/projects'
import { z } from 'zod'
import { logger } from '@/lib/logger'

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const userId = await requireApiAuth()
    const body = await request.json()
    const validated = projectSchema.partial().parse(body)
    const { id } = context.params
    
    const project = await projectsService.updateProject(id, userId, validated)
    
    return NextResponse.json(project)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.error('Failed to update project', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
