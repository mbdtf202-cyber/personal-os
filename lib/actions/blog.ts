'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { blogService } from '@/lib/services/blog'
import { requireAuth } from '@/lib/auth'
import { postSchema } from '@/lib/validations/blog'
import { z } from 'zod'

export async function createPost(data: z.infer<typeof postSchema>) {
  try {
    const userId = await requireAuth()
    const validated = postSchema.parse(data)
    
    const post = await blogService.createPost(userId, validated)
    
    revalidatePath('/blog')
    return { success: true, data: post }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.issues }
    }
    return { success: false, error: 'Failed to create post' }
  }
}

export async function updatePost(id: string, data: Partial<z.infer<typeof postSchema>>) {
  try {
    const userId = await requireAuth()
    
    const post = await blogService.updatePost(id, userId, data)
    
    revalidatePath('/blog')
    revalidatePath(`/blog/${id}`)
    return { success: true, data: post }
  } catch (error) {
    return { success: false, error: 'Failed to update post' }
  }
}

export async function deletePost(id: string) {
  try {
    const userId = await requireAuth()
    
    await blogService.deletePost(id, userId)
    
    revalidatePath('/blog')
    redirect('/blog')
  } catch (error) {
    return { success: false, error: 'Failed to delete post' }
  }
}
