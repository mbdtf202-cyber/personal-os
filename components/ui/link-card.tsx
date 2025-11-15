"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Star, Check, Play, Users, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LinkCardProps {
  title: string
  url: string
  description?: string | null
  siteName?: string | null
  domain?: string | null
  faviconUrl?: string | null
  imageUrl?: string | null
  type?: string
  tags?: string[]
  isRead?: boolean
  isFavorite?: boolean
  onToggleRead?: () => void
  onToggleFavorite?: () => void
  onClick?: () => void
  className?: string
  isUpdating?: boolean
}

export function LinkCard({
  title,
  url,
  description,
  siteName,
  domain,
  faviconUrl,
  imageUrl,
  type = 'other',
  tags = [],
  isRead = false,
  isFavorite = false,
  onToggleRead,
  onToggleFavorite,
  onClick,
  className,
  isUpdating = false,
}: LinkCardProps) {
  const [previewError, setPreviewError] = useState(false)
  const [faviconError, setFaviconError] = useState(false)

  const getTypeIcon = () => {
    switch (type) {
      case 'video':
        return <Play className="h-3 w-3" />
      case 'social':
        return <Users className="h-3 w-3" />
      case 'tool':
        return <Wrench className="h-3 w-3" />
      default:
        return null
    }
  }

  const getTypeBadge = () => {
    const typeLabels: Record<string, string> = {
      video: 'Video',
      social: 'Social',
      tool: 'Tool',
      article: 'Article',
    }
    return typeLabels[type] || null
  }

  return (
    <Card className={cn('hover:shadow-md transition-shadow', isRead && 'opacity-60', className)}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Preview Image or Placeholder */}
          {imageUrl && !previewError ? (
            <div className="relative h-28 w-40 overflow-hidden rounded">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="160px"
                onError={() => setPreviewError(true)}
              />
            </div>
          ) : faviconUrl && !faviconError ? (
            <div className="flex-shrink-0 w-40 h-28 bg-secondary rounded flex items-center justify-center">
              <Image
                src={faviconUrl}
                alt=""
                width={48}
                height={48}
                className="opacity-50"
                onError={() => setFaviconError(true)}
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-40 h-28 rounded bg-secondary/60" />
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header: Favicon + Site Name + Type Badge */}
            <div className="flex items-center gap-2 mb-2">
              {faviconUrl && !faviconError && (
                <Image
                  src={faviconUrl}
                  alt=""
                  width={16}
                  height={16}
                  onError={() => setFaviconError(true)}
                />
              )}
              <span className="text-xs text-muted-foreground">
                {siteName || domain}
              </span>
              {getTypeBadge() && (
                <Badge variant="secondary" className="text-xs">
                  {getTypeIcon()}
                  <span className="ml-1">{getTypeBadge()}</span>
                </Badge>
              )}
            </div>

            {/* Title */}
            <h3
              className="font-semibold line-clamp-2 mb-2 cursor-pointer hover:text-primary"
              onClick={onClick}
            >
              {title}
            </h3>

            {/* Description */}
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {description}
              </p>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {tags.slice(0, 5).map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-secondary px-2 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Visit
              </a>
              {onToggleRead && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onToggleRead}
                  className="h-7 px-2"
                  disabled={isUpdating}
                >
                  <Check
                    className={cn(
                      'h-4 w-4',
                      isRead && 'text-green-600'
                    )}
                  />
                </Button>
              )}
              {onToggleFavorite && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onToggleFavorite}
                  className="h-7 px-2"
                  disabled={isUpdating}
                >
                  <Star
                    className={cn(
                      'h-4 w-4',
                      isFavorite && 'fill-yellow-400 text-yellow-400'
                    )}
                  />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
