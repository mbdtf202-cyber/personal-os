import { z } from 'zod'

export const bookmarkSchema = z.object({
  title: z.string().min(1).max(200),
  url: z.string().url(),
  description: z.string().optional(),
  siteName: z.string().optional(),
  domain: z.string().optional(),
  faviconUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  type: z.enum(['article', 'video', 'tool', 'social', 'other']).default('other'),
  category: z.enum(['ARTICLE', 'VIDEO', 'TOOL', 'DOCUMENTATION', 'INSPIRATION', 'OTHER']),
  status: z.enum(['TO_READ', 'READING', 'DONE']).default('TO_READ'),
})

export const updateBookmarkSchema = z.object({
  isRead: z.boolean().optional(),
  isFavorited: z.boolean().optional(),
})
