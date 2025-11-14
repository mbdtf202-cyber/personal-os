import { NextResponse } from 'next/server'
import { projectsService } from '@/lib/services/projects'
import { requireAuth } from '@/lib/auth'
import { projectSchema } from '@/lib/validations/projects'
import { linkPreviewService } from '@/lib/services/link-preview'
import { z } from 'zod'

export async function GET(request: Request) {
  try {
    const userId = await requireAuth()
    const { searchParams } = new URL(request.url)
    
    const filters = {
      status: searchParams.get('status') || undefined,
      isPublic: searchParams.get('isPublic') === 'true' ? true : undefined,
    }
    
    const projects = await projectsService.getProjects(userId, filters)
    
    return NextResponse.json({ projects, total: projects.length })
  } catch (error) {
    console.error('Failed to get projects:', error)
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
    
    // If URL is provided, fetch project info
    if (body.url) {
      const url = body.url
      
      // Check if it's a GitHub URL
      if (linkPreviewService.isGitHubUrl(url)) {
        try {
          const repoInfo = await linkPreviewService.fetchGitHubRepo(url)
          
          // Merge with provided data, preferring user input
          body.title = body.title || repoInfo.name
          body.description = body.description || repoInfo.description
          body.githubUrl = body.githubUrl || repoInfo.repoUrl
          body.liveUrl = body.liveUrl || repoInfo.demoUrl
          body.stars = body.stars ?? repoInfo.stars
          body.language = body.language || repoInfo.language
          body.techStack = body.techStack || repoInfo.topics.join(', ')
        } catch (error) {
          console.error('Failed to fetch GitHub info:', error)
          // Continue with manual data
        }
      } else {
        // Try generic link preview
        try {
          const preview = await linkPreviewService.fetchPreview(url)
          body.title = body.title || preview.title
          body.description = body.description || preview.description
          body.previewImage = body.previewImage || preview.image
        } catch (error) {
          console.error('Failed to fetch preview:', error)
          // Continue with manual data
        }
      }
      
      // Remove url from body as it's not in the schema
      delete body.url
    }
    
    const validated = projectSchema.parse(body)
    const project = await projectsService.createProject(userId, validated)
    
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Failed to create project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
