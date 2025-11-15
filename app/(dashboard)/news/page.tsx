'use client'

import { useState } from 'react'
import { AddNewsLinkDialog } from '@/components/news/add-news-link-dialog'
import { NewsCard } from '@/components/news/news-card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useNewsItems } from '@/hooks/useNewsItems'

export default function NewsPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'favorites'>('all')
  const { items, isPending, isError, refetch, queryKey, error } = useNewsItems(filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">News</h1>
          <p className="text-muted-foreground mt-1">
            Your curated news feed
          </p>
        </div>
        <AddNewsLinkDialog onSuccess={() => refetch()} />
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread' | 'favorites')}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
      </Tabs>

      {isPending ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">Unable to load news items.</p>
          <Button
            variant="link"
            className="h-auto p-0 text-sm"
            onClick={() => refetch()}
          >
            Try again
          </Button>
          {error instanceof Error && (
            <p className="mt-2 text-xs text-muted-foreground">{error.message}</p>
          )}
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
            <NewsCard key={item.id} item={item} queryKey={queryKey} />
          ))}
        </div>
      )}
    </div>
  )
}
