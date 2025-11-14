import { z } from 'zod'

export const newsSourceSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['AI', 'FINANCE', 'WEB3', 'TECH', 'OTHER']),
  url: z.string().url(),
  fetchStrategy: z.enum(['RSS', 'API', 'MANUAL']),
})

export const newsItemSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  summary: z.string().optional(),
  category: z.string().optional(),
  publishedAt: z.coerce.date(),
})

export const updateNewsItemSchema = z.object({
  isRead: z.boolean().optional(),
  isFavorited: z.boolean().optional(),
})
