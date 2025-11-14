import { prisma } from '@/lib/prisma'

export class ProjectsService {
  async getProjects(userId: string, filters?: {
    status?: string
    isPublic?: boolean
  }) {
    return prisma.project.findMany({
      where: {
        userId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.isPublic !== undefined && { isPublic: filters.isPublic }),
      },
      include: {
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getProjectById(id: string, userId: string) {
    return prisma.project.findFirst({
      where: { id, userId },
      include: {
        tags: true,
      },
    })
  }

  async createProject(userId: string, data: {
    title: string
    description?: string
    longDescription?: string
    status?: string
    techStack?: string
    githubUrl?: string
    liveUrl?: string
    imageUrl?: string
    previewImage?: string
    stars?: number
    language?: string
    startDate?: Date
    endDate?: Date
    isPublic?: boolean
  }) {
    return prisma.project.create({
      data: {
        ...data,
        userId,
        status: data.status || 'IDEA',
        isPublic: data.isPublic || false,
      },
    })
  }

  async updateProject(id: string, userId: string, data: Partial<{
    title: string
    description: string
    status: string
    techStack: string
    githubUrl: string
    liveUrl: string
    imageUrl: string
    startDate: Date
    endDate: Date
    isPublic: boolean
  }>) {
    return prisma.project.update({
      where: { id, userId },
      data,
    })
  }
}

export const projectsService = new ProjectsService()
export const projectService = projectsService
