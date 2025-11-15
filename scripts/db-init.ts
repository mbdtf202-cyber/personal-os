// 数据库初始化脚本
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

async function main() {
  try {
    logger.info('Starting database initialization...')

    // 验证连接
    await prisma.$queryRaw`SELECT 1`
    logger.info('✅ Database connection verified')

    // 创建默认用户
    const user = await prisma.user.findUnique({
      where: { id: 'local-user' },
    })

    if (!user) {
      await prisma.user.create({
        data: {
          id: 'local-user',
          email: 'user@local.dev',
          name: 'Local User',
          password: 'not-used',
        },
      })
      logger.info('✅ Default user created')
    } else {
      logger.info('✅ Default user already exists')
    }

    logger.info('✅ Database initialization completed')
  } catch (error) {
    logger.error('Database initialization failed', error as Error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
