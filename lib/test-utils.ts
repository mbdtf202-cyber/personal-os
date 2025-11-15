// 测试工具
import { prisma } from './prisma'

export async function createTestUser(overrides?: Partial<any>) {
  return prisma.user.create({
    data: {
      id: `test-user-${Date.now()}`,
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      password: 'test-password',
      ...overrides,
    },
  })
}

export async function createTestHealthLog(userId: string, overrides?: Partial<any>) {
  return prisma.healthDailyLog.create({
    data: {
      userId,
      date: new Date(),
      sleepHours: 8,
      exerciseMinutes: 30,
      moodScore: 7,
      energyScore: 7,
      stressLevel: 3,
      ...overrides,
    },
  })
}

export async function createTestBookmark(userId: string, overrides?: Partial<any>) {
  return prisma.bookmark.create({
    data: {
      userId,
      url: 'https://example.com',
      title: 'Test Bookmark',
      category: 'test',
      ...overrides,
    },
  })
}

export async function createTestProject(userId: string, overrides?: Partial<any>) {
  return prisma.project.create({
    data: {
      userId,
      title: 'Test Project',
      status: 'IDEA',
      ...overrides,
    },
  })
}

export async function cleanupTestData(userId: string) {
  await Promise.all([
    prisma.healthDailyLog.deleteMany({ where: { userId } }),
    prisma.bookmark.deleteMany({ where: { userId } }),
    prisma.project.deleteMany({ where: { userId } }),
    prisma.post.deleteMany({ where: { userId } }),
    prisma.trade.deleteMany({ where: { userId } }),
  ])
}

export async function cleanupTestUser(userId: string) {
  await cleanupTestData(userId)
  await prisma.user.delete({ where: { id: userId } })
}
