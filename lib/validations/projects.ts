import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  longDescription: z.string().optional(),
  status: z.enum(['IDEA', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED']).default('IDEA'),
  techStack: z.string().optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  previewImage: z.string().url().optional().or(z.literal('')),
  stars: z.number().int().optional(),
  language: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  isPublic: z.boolean().default(false),
})

export const updateProjectSchema = projectSchema.partial()
