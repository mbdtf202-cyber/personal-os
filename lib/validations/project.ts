import { z } from 'zod'

export const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  techStack: z.string().max(500).optional(),
  status: z.enum(['IDEA', 'PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD']).default('IDEA'),
})

export const updateProjectSchema = createProjectSchema.partial()

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
