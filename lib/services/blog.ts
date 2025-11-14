import { prisma } from '@/lib/prisma'

export class BlogService {
  async getPosts(userId: string, filters?: {
    status?: string
    category?: string
  }) {
    return prisma.post.findMany({
      where: {
        userId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.category && { category: filters.category }),
      },
      include: {
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getPost(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        tags: true,
        links: true,
      },
    })
  }

  async getPostById(id: string, userId: string) {
    return prisma.post.findFirst({
      where: { id, userId },
      include: {
        tags: true,
        links: true,
      },
    })
  }

  async createPost(userId: string, data: {
    title: string
    contentMarkdown?: string
    category: string
    status?: string
  }) {
    return prisma.post.create({
      data: {
        ...data,
        userId,
        status: data.status || 'DRAFT',
      },
    })
  }

  async updatePost(id: string, userId: string, data: Partial<{
    title: string
    contentMarkdown: string
    category: string
    status: string
  }>) {
    return prisma.post.update({
      where: { id, userId },
      data: {
        ...data,
        ...(data.status === 'PUBLISHED' && !data.hasOwnProperty('publishedAt') && {
          publishedAt: new Date(),
        }),
      },
    })
  }

  async deletePost(id: string, userId: string) {
    return prisma.post.delete({
      where: { id, userId },
    })
  }
}

export const blogService = new BlogService()
