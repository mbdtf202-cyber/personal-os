import { z } from 'zod'

export const healthLogSchema = z.object({
  date: z.coerce.date(),
  sleepStart: z.coerce.date().optional().nullable(),
  sleepEnd: z.coerce.date().optional().nullable(),
  sleepHours: z.number().min(0).max(24).optional().nullable(),
  exerciseMinutes: z.number().int().min(0).max(1440).optional().nullable(),
  exerciseType: z.string().max(100).optional().nullable(),
  moodScore: z.number().int().min(1).max(10).optional().nullable(),
  energyScore: z.number().int().min(1).max(10).optional().nullable(),
  stressLevel: z.number().int().min(1).max(10).optional().nullable(),
  remark: z.string().max(500).optional().nullable(),
})

export const habitSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().nullable(),
  frequencyType: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
  targetTimesPerPeriod: z.number().int().min(1),
})

export const habitCheckinSchema = z.object({
  habitId: z.string(),
  date: z.coerce.date(),
  done: z.boolean().default(true),
})

export const createHealthLogSchema = z.object({
  date: z.string().datetime(),
  sleepHours: z.number().min(0).max(24).optional(),
  exerciseMinutes: z.number().min(0).max(1440).optional(),
  moodScore: z.number().min(1).max(10),
  energyScore: z.number().min(1).max(10),
  stressLevel: z.number().min(1).max(10),
  remark: z.string().optional(),
})

export const updateHealthLogSchema = createHealthLogSchema.partial()

export type CreateHealthLogInput = z.infer<typeof createHealthLogSchema>
export type UpdateHealthLogInput = z.infer<typeof updateHealthLogSchema>
