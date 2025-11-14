import { prisma } from '@/lib/prisma'

export class SocialService {
  async getSocialPosts(userId: string, filters?: {
    platform?: string
    status?: string
  }) {
    return prisma.socialPost.findMany({
      where: {
        userId,
        ...(filters?.platform && { platform: filters.platform }),
        ...(filters?.status && { status: filters.status }),
      },
      include: {
        tags: true,
        stats: {
          orderBy: { snapshotTime: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async createSocialPost(userId: string, data: {
    platform: string
    title: string
    contentText: string
    status?: string
  }) {
    return prisma.socialPost.create({
      data: {
        ...data,
        userId,
        status: data.status || 'IDEA',
      },
    })
  }

  async updateSocialPost(id: string, userId: string, data: Partial<{
    title: string
    contentText: string
    status: string
    url: string
  }>) {
    return prisma.socialPost.update({
      where: { id, userId },
      data,
    })
  }
}

export const socialService = new SocialService()
