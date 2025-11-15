// 数据导入服务
import { prisma } from '@/lib/prisma'

export class DataImportService {
  async importFromJSON(userId: string, data: any) {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    }

    try {
      // 导入健康数据
      if (data.modules?.health) {
        await this.importHealthData(userId, data.modules.health, results)
      }

      // 导入博客数据
      if (data.modules?.blog) {
        await this.importBlogData(userId, data.modules.blog, results)
      }

      // 导入项目数据
      if (data.modules?.projects) {
        await this.importProjectsData(userId, data.modules.projects, results)
      }

      return results
    } catch (error) {
      results.errors.push(`Import failed: ${error}`)
      return results
    }
  }

  private async importHealthData(userId: string, data: any, results: any) {
    if (data.logs) {
      for (const log of data.logs) {
        try {
          await prisma.healthDailyLog.create({
            data: { ...log, userId },
          })
          results.success++
        } catch (error) {
          results.failed++
          results.errors.push(`Health log import failed: ${error}`)
        }
      }
    }
  }

  private async importBlogData(userId: string, data: any, results: any) {
    for (const post of data) {
      try {
        await prisma.post.create({
          data: {
            ...post,
            userId,
            tags: { connect: [] },
          },
        })
        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(`Blog post import failed: ${error}`)
      }
    }
  }

  private async importProjectsData(userId: string, data: any, results: any) {
    for (const project of data) {
      try {
        await prisma.project.create({
          data: {
            ...project,
            userId,
            tags: { connect: [] },
          },
        })
        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(`Project import failed: ${error}`)
      }
    }
  }
}

export const dataImportService = new DataImportService()
