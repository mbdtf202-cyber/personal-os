import { z } from 'zod'

export const createBookmarkSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  category: z.string().min(1).max(50).default('other'),
})

export const updateBookmarkSchema = createBookmarkSchema.partial()

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>
export type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>
