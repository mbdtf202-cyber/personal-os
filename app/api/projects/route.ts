import { NextResponse } from 'next/server'
import { projectsService } from '@/lib/services/projects'
import { requireApiAuth, UnauthorizedError } from '@/lib/auth'
import { projectSchema } from '@/lib/validations/projects'
import { linkPreviewService, LinkPreviewError } from '@/lib/services/link-preview'
import { logger } from '@/lib/logger'
import { z } from 'zod'

export async function GET(request: Request) {
  try {
    const userId = await requireApiAuth()
    const { searchParams } = new URL(request.url)

    const filters = {
      status: searchParams.get('status') || undefined,
      isPublic: searchParams.get('isPublic') === 'true' ? true : undefined,
    }

    const projects = await projectsService.getProjects(userId, filters)

    return NextResponse.json({ projects, total: projects.length })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.error('Failed to get projects', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireApiAuth()
    const body = await request.json()

    if (body.url) {
      const url = body.url

      if (linkPreviewService.isGitHubUrl(url)) {
        try {
          const repoInfo = await linkPreviewService.fetchGitHubRepo(url)
          body.title = body.title || repoInfo.name
          body.description = body.description || repoInfo.description
          body.githubUrl = body.githubUrl || repoInfo.repoUrl
          body.liveUrl = body.liveUrl || repoInfo.demoUrl
          body.stars = body.stars ?? repoInfo.stars
          body.language = body.language || repoInfo.language
          body.techStack = body.techStack || repoInfo.topics.join(', ')
        } catch (error) {
          logger.warn('Failed to fetch GitHub info for project', {
            url,
            error: error instanceof Error ? error.message : String(error),
          })
        }
      } else {
        try {
          const preview = await linkPreviewService.fetchPreview(url)
          body.title = body.title || preview.title
          body.description = body.description || preview.description
          body.previewImage = body.previewImage || preview.image
        } catch (error) {
          if (error instanceof LinkPreviewError) {
            logger.warn('Project link preview rejected', {
              url,
              error: error.message,
            })
          } else {
            logger.warn('Failed to fetch project preview', {
              url,
              error: error instanceof Error ? error.message : String(error),
            })
          }
        }
      }

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

    if (error instanceof LinkPreviewError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.error('Failed to create project', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
