'use client'

import { useState, useEffect } from 'react'
import { AddNewsLinkDialog } from '@/components/news/add-news-link-dialog'
import { NewsCard } from '@/components/news/news-card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'favorites'>('all')

  async function loadItems() {
    try {
      const params = new URLSearchParams()
      if (filter === 'unread') params.set('isRead', 'false')
      if (filter === 'favorites') params.set('isFavorited', 'true')

      const response = await fetch(`/api/news/items?${params}`)
      if (!response.ok) throw new Error('Failed to load items')

      const data = await response.json()
      setItems(data.items)
    } catch (error) {
      console.error('Failed to load news items:', error)
      toast.error('Failed to load news items')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [filter])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">News</h1>
          <p className="text-muted-foreground mt-1">
            Your curated news feed
          </p>
        </div>
        <AddNewsLinkDialog onSuccess={loadItems} />
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No news items yet. Add your first link!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} onUpdate={loadItems} />
          ))}
        </div>
      )}
    </div>
  )
}
