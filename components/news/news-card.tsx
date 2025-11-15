'use client'

import type { QueryKey } from '@tanstack/react-query'
import { LinkCard } from '@/components/ui/link-card'
import { toast } from 'sonner'
import { useNewsItemMutation, type NewsItem } from '@/hooks/useNewsItems'

interface NewsCardProps {
  item: NewsItem
  queryKey: QueryKey
}

export function NewsCard({ item, queryKey }: NewsCardProps) {
  const mutation = useNewsItemMutation(queryKey)

  async function handleToggleRead() {
    try {
      await mutation.mutateAsync({
        id: item.id,
        updates: { isRead: !item.isRead },
      })
      toast.success(item.isRead ? 'Marked as unread' : 'Marked as read')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update status'
      toast.error(message)
    }
  }

  async function handleToggleFavorite() {
    try {
      await mutation.mutateAsync({
        id: item.id,
        updates: { isFavorited: !item.isFavorited },
      })
      toast.success(
        item.isFavorited ? 'Removed from favorites' : 'Added to favorites'
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update status'
      toast.error(message)
    }
  }

  return (
    <LinkCard
      title={item.title}
      url={item.url}
      description={item.summary}
      siteName={item.siteName || item.source.name}
      domain={item.domain}
      faviconUrl={item.faviconUrl}
      imageUrl={item.previewImage}
      type={item.type}
      isRead={item.isRead}
      isFavorite={item.isFavorited}
      onToggleRead={handleToggleRead}
      onToggleFavorite={handleToggleFavorite}
      isUpdating={mutation.isPending}
    />
  )
}
