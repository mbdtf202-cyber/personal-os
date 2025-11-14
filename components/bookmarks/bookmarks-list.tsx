'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'

interface Bookmark {
  id: string
  url: string
  title: string
  description?: string | null
  siteName?: string | null
  domain?: string | null
  faviconUrl?: string | null
  imageUrl?: string | null
  type?: string
  category: string
  status: string
  visitCount: number
  lastVisitedAt?: Date | null
  createdAt: Date
}

interface BookmarksListProps {
  bookmarks: Bookmark[]
}

export function BookmarksList({ bookmarks }: BookmarksListProps) {
  const [filter, setFilter] = useState<'all' | 'to_read' | 'reading' | 'done'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const statusMatch = filter === 'all' || bookmark.status.toLowerCase() === filter
    const categoryMatch = categoryFilter === 'all' || bookmark.category === categoryFilter
    return statusMatch && categoryMatch
  })

  const categories = Array.from(new Set(bookmarks.map(b => b.category)))

  const handleVisit = async (id: string, url: string) => {
    try {
      await fetch(`/api/bookmarks/${id}/visit`, {
        method: 'PATCH',
      })
      window.open(url, '_blank')
    } catch (error) {
      console.error('Failed to record visit:', error)
      window.open(url, '_blank')
    }
  }

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'ARTICLE': return '📄'
      case 'VIDEO': return '🎥'
      case 'TOOL': return '🔧'
      case 'DOCUMENTATION': return '📚'
      case 'INSPIRATION': return '💡'
      default: return '📌'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TO_READ': return 'secondary'
      case 'READING': return 'default'
      case 'DONE': return 'default'
      default: return 'secondary'
    }
  }

  if (bookmarks.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          No bookmarks yet. Add your first bookmark!
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({bookmarks.length})
        </Button>
        <Button
          variant={filter === 'to_read' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('to_read')}
        >
          To Read ({bookmarks.filter(b => b.status === 'TO_READ').length})
        </Button>
        <Button
          variant={filter === 'reading' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('reading')}
        >
          Reading ({bookmarks.filter(b => b.status === 'READING').length})
        </Button>
        <Button
          variant={filter === 'done' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('done')}
        >
          Done ({bookmarks.filter(b => b.status === 'DONE').length})
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={categoryFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCategoryFilter('all')}
        >
          All Categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={categoryFilter === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter(category)}
          >
            {getCategoryEmoji(category)} {category}
          </Button>
        ))}
      </div>

      {filteredBookmarks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No bookmarks found with selected filters
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredBookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {bookmark.faviconUrl && (
                    <img
                      src={bookmark.faviconUrl}
                      alt=""
                      className="w-5 h-5 mt-1"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <button
                        onClick={() => handleVisit(bookmark.id, bookmark.url)}
                        className="font-semibold text-primary hover:underline text-left line-clamp-2"
                      >
                        {bookmark.title}
                      </button>
                      <Badge variant={getStatusColor(bookmark.status) as any} className="flex-shrink-0">
                        {bookmark.status}
                      </Badge>
                    </div>
                    {bookmark.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {bookmark.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{getCategoryEmoji(bookmark.category)} {bookmark.category}</span>
                      {bookmark.visitCount > 0 && (
                        <>
                          <span>•</span>
                          <span>{bookmark.visitCount} visits</span>
                        </>
                      )}
                      <span>•</span>
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleVisit(bookmark.id, bookmark.url)
                        }}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
