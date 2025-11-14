import { z } from 'zod'

export const socialPostSchema = z.object({
  platform: z.enum(['XIAOHONGSHU', 'X', 'WECHAT', 'OTHER']),
  title: z.string().min(1).max(200),
  contentText: z.string().min(1),
  status: z.enum(['IDEA', 'DRAFT', 'SCHEDULED', 'POSTED']).default('IDEA'),
  plannedPublishTime: z.coerce.date().optional(),
  url: z.string().url().optional(),
})

export const socialPostStatsSchema = z.object({
  views: z.number().int().min(0).default(0),
  likes: z.number().int().min(0).default(0),
  comments: z.number().int().min(0).default(0),
  shares: z.number().int().min(0).default(0),
  collects: z.number().int().min(0).default(0),
})
