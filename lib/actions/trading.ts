'use server'

import { revalidatePath } from 'next/cache'
import { tradingService } from '@/lib/services/trading'
import { requireAuth } from '@/lib/auth'
import { tradeSchema, tradingSummarySchema } from '@/lib/validations/trading'
import { z } from 'zod'

export async function createTrade(data: z.infer<typeof tradeSchema>) {
  try {
    const userId = await requireAuth()
    const validated = tradeSchema.parse(data)
    
    const trade = await tradingService.createTrade(userId, validated)
    
    revalidatePath('/trading')
    return { success: true, data: trade }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.issues }
    }
    return { success: false, error: 'Failed to create trade' }
  }
}

export async function createTradingSummary(data: z.infer<typeof tradingSummarySchema>) {
  try {
    const userId = await requireAuth()
    const validated = tradingSummarySchema.parse(data)
    
    const summary = await tradingService.createTradingSummary(userId, validated)
    
    revalidatePath('/trading')
    return { success: true, data: summary }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.issues }
    }
    return { success: false, error: 'Failed to create summary' }
  }
}
