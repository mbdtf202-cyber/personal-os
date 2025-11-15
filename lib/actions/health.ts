'use server'

import { revalidatePath } from 'next/cache'
import { healthService } from '@/lib/services/health'
import { requireApiAuth, UnauthorizedError } from '@/lib/auth'
import { healthLogSchema, habitSchema, habitCheckinSchema } from '@/lib/validations/health'
import { z } from 'zod'

export async function createHealthLog(data: z.infer<typeof healthLogSchema>) {
  try {
    const userId = await requireApiAuth()
    const validated = healthLogSchema.parse(data)
    
    const log = await healthService.createHealthLog(userId, validated)
    
    revalidatePath('/health')
    return { success: true, data: log }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.issues }
    }
    if (error instanceof UnauthorizedError) {
      return { success: false, error: 'Unauthorized' }
    }
    return { success: false, error: 'Failed to create health log' }
  }
}

export async function updateHealthLog(id: string, data: Partial<z.infer<typeof healthLogSchema>>) {
  try {
    const userId = await requireApiAuth()
    
    const log = await healthService.updateHealthLog(id, userId, data)
    
    revalidatePath('/health')
    return { success: true, data: log }
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return { success: false, error: 'Unauthorized' }
    }
    return { success: false, error: 'Failed to update health log' }
  }
}

export async function createHabit(data: z.infer<typeof habitSchema>) {
  try {
    const userId = await requireApiAuth()
    const validated = habitSchema.parse(data)
    
    const habit = await healthService.createHabit(userId, validated)
    
    revalidatePath('/health/habits')
    return { success: true, data: habit }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.issues }
    }
    if (error instanceof UnauthorizedError) {
      return { success: false, error: 'Unauthorized' }
    }
    return { success: false, error: 'Failed to create habit' }
  }
}

export async function checkinHabit(data: z.infer<typeof habitCheckinSchema>) {
  try {
    await requireApiAuth()
    const validated = habitCheckinSchema.parse(data)
    
    const checkin = await healthService.checkinHabit(
      validated.habitId,
      validated.date,
      validated.done
    )
    
    revalidatePath('/health/habits')
    return { success: true, data: checkin }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.issues }
    }
    if (error instanceof UnauthorizedError) {
      return { success: false, error: 'Unauthorized' }
    }
    return { success: false, error: 'Failed to check in habit' }
  }
}
