import { z } from 'zod'

// Schema for creating a new post (step 1: title and metadata only)
export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  category: z.string().min(1, 'Category is required'),
  tagIds: z.array(z.string()).optional(),
})

// Schema for full post with content
export const postSchema = z.object({
  title: z.string().min(1).max(200),
  contentMarkdown: z.string().optional(),
  category: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  tagIds: z.array(z.string()).optional(),
})

export const updatePostSchema = postSchema.partial()
