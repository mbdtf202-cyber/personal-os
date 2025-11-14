import { prisma } from '@/lib/prisma'

export class TagService {
  async getTags() {
    return prisma.tag.findMany({
      orderBy: { name: 'asc' },
    })
  }

  async createTag(name: string, type: string = 'GENERAL') {
    return prisma.tag.create({
      data: {
        name,
        type,
      },
    })
  }

  async getOrCreateTag(name: string, type: string = 'GENERAL') {
    const existing = await prisma.tag.findFirst({
      where: {
        name: {
          equals: name,
        },
      },
    })

    if (existing) {
      return existing
    }

    return this.createTag(name, type)
  }

  async getTagsByEntity(entityType: string, entityId: string) {
    // This would need to be implemented based on your specific tag relationships
    // For now, returning empty array as placeholder
    return []
  }

  async deleteTag(id: string) {
    return prisma.tag.delete({
      where: {
        id,
      },
    })
  }
}

export const tagService = new TagService()
