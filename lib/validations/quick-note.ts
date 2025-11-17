import { z } from 'zod'

export const createQuickNoteSchema = z.object({
  title: z
    .string()
    .max(120, '标题不能超过 120 个字符')
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  content: z
    .string({ required_error: '请填写内容' })
    .min(1, '内容不能为空')
    .max(2000, '内容不能超过 2000 个字符'),
  isPinned: z.boolean().optional(),
})

export const updateQuickNoteSchema = createQuickNoteSchema
  .partial()
  .extend({
    content: z
      .string()
      .min(1, '内容不能为空')
      .max(2000, '内容不能超过 2000 个字符')
      .optional(),
  })
  .refine(
    (value) => value.title !== undefined || value.content !== undefined || value.isPinned !== undefined,
    {
      message: '更新内容不能为空',
      path: ['content'],
    },
  )
