'use client'

import { useState } from 'react'
import { LinkCard } from '@/components/ui/link-card'
import { toast } from 'sonner'

interface NewsItem {
  id: string
  title: string
  url: string
  summary: string | null
  previewImage: string | null
  siteName: string | null
  domain: string | null
  faviconUrl: string | null
  type: string
  publishedAt: string
  isRead: boolean
  isFavorited: boolean
  source: {
    name: string
    type: string
  }
}

interface NewsCardProps {
  item: NewsItem
  onUpdate?: () => void
}

export function NewsCard({ item, onUpdate }: NewsCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  async function toggleRead() {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/news/items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !item.isRead }),
      })

      if (!response.ok) throw new Error('Failed to update')

      toast.success(item.isRead ? 'Marked as unread' : 'Marked as read')
      onUpdate?.()
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  async function toggleFavorite() {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/news/items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorited: !item.isFavorited }),
      })

      if (!response.ok) throw new Error('Failed to update')

      toast.success(
        item.isFavorited ? 'Removed from favorites' : 'Added to favorites'
      )
      onUpdate?.()
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setIsUpdating(false)
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
      onToggleRead={toggleRead}
      onToggleFavorite={toggleFavorite}
    />
  )
}
