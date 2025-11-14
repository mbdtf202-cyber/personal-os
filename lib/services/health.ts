import { prisma } from '@/lib/prisma'
import { subDays, startOfDay, endOfDay } from 'date-fns'
import type { HealthDailyLog, Habit, HabitCheckin } from '@prisma/client'

export class HealthService {
  async getHealthLogs(userId: string, startDate: Date, endDate: Date) {
    return prisma.healthDailyLog.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
      orderBy: { date: 'desc' },
    })
  }

  async getHealthLogByDate(userId: string, date: Date) {
    return prisma.healthDailyLog.findUnique({
      where: {
        userId_date: {
          userId,
          date: startOfDay(date),
        },
      },
    })
  }

  async createHealthLog(userId: string, data: {
    date: Date
    sleepStart?: Date | null
    sleepEnd?: Date | null
    sleepHours?: number | null
    exerciseMinutes?: number | null
    exerciseType?: string | null
    moodScore?: number | null
    energyScore?: number | null
    stressLevel?: number | null
    remark?: string | null
  }) {
    return prisma.healthDailyLog.create({
      data: {
        ...data,
        userId,
      },
    })
  }

  async updateHealthLog(id: string, userId: string, data: Partial<HealthDailyLog>) {
    return prisma.healthDailyLog.update({
      where: { id, userId },
      data,
    })
  }

  async getTodayHealthStatus(userId: string) {
    const today = startOfDay(new Date())
    
    const log = await prisma.healthDailyLog.findUnique({
      where: {
        userId_date: { userId, date: today },
      },
    })
    
    return {
      hasLog: !!log,
      completeness: this.calculateCompleteness(log),
      log,
    }
  }

  async getHabits(userId: string) {
    return prisma.habit.findMany({
      where: { userId },
      include: {
        checkins: {
          where: {
            date: {
              gte: subDays(new Date(), 30),
            },
          },
          orderBy: { date: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async createHabit(userId: string, data: {
    name: string
    description?: string | null
    frequencyType: string
    targetTimesPerPeriod: number
  }) {
    return prisma.habit.create({
      data: {
        ...data,
        userId,
      },
    })
  }

  async checkinHabit(habitId: string, date: Date, done: boolean = true) {
    return prisma.habitCheckin.upsert({
      where: {
        habitId_date: {
          habitId,
          date: startOfDay(date),
        },
      },
      create: {
        habitId,
        date: startOfDay(date),
        done,
      },
      update: {
        done,
      },
    })
  }

  async trackHabit(habitId: string, date: Date) {
    return this.checkinHabit(habitId, date, true)
  }

  async getHabitProgress(userId: string, habitId: string, period: 'week' | 'month') {
    const startDate = period === 'week' ? subDays(new Date(), 7) : subDays(new Date(), 30)
    
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId },
      include: {
        checkins: {
          where: {
            date: { gte: startDate },
          },
        },
      },
    })

    if (!habit) return null

    const completed = habit.checkins.filter(c => c.done).length
    const total = habit.checkins.length

    return {
      habit,
      completed,
      total,
      rate: total > 0 ? (completed / total) * 100 : 0,
    }
  }

  private calculateCompleteness(log: HealthDailyLog | null): number {
    if (!log) return 0
    
    const fields = ['sleepHours', 'exerciseMinutes', 'moodScore', 'energyScore']
    const filled = fields.filter(f => log[f as keyof HealthDailyLog] != null).length
    
    return (filled / fields.length) * 100
  }
}

export const healthService = new HealthService()
