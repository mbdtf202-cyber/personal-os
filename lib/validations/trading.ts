import { z } from 'zod'

export const tradeSchema = z.object({
  date: z.coerce.date(),
  market: z.enum(['A_STOCK', 'US_STOCK', 'CRYPTO', 'FOREX', 'FUTURES']),
  symbol: z.string().min(1),
  direction: z.enum(['LONG', 'SHORT']),
  entryPrice: z.number().positive(),
  exitPrice: z.number().positive(),
  quantity: z.number().positive(),
  pnl: z.number(),
  fees: z.number().min(0),
  strategyTag: z.string().optional(),
  reasonOpen: z.string().optional(),
  reasonClose: z.string().optional(),
})

export const tradingSummarySchema = z.object({
  date: z.coerce.date(),
  totalPnl: z.number(),
  mistakes: z.string().optional(),
  whatWentWell: z.string().optional(),
  planForTomorrow: z.string().optional(),
})
