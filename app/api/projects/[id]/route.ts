import { NextResponse } from 'next/server'
import { projectsService } from '@/lib/services/projects'
import { requireAuth } from '@/lib/auth'
import { projectSchema } from '@/lib/validations/projects'
import { z } from 'zod'

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth()
    const body = await request.json()
    const validated = projectSchema.partial().parse(body)
    const { id } = await context.params
    
    const project = await projectsService.updateProject(id, userId, validated)
    
    return NextResponse.json(project)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Failed to update project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
