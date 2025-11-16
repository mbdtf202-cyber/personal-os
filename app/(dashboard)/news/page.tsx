'use client'

import { useState } from 'react'
import { AddNewsLinkDialog } from '@/components/news/add-news-link-dialog'
import { NewsCard } from '@/components/news/news-card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useNewsItems } from '@/hooks/useNewsItems'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'

export default function NewsPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'favorites'>('all')
  const { items, isPending, isError, refetch, queryKey, error } = useNewsItems(filter)

  return (
    <div className="space-y-8">
      <PageHeader
        title="资讯中心"
        description="追踪你订阅的所有文章与链接，支持一键收藏、标记已读。"
        accent="sunset"
        actions={<AddNewsLinkDialog onSuccess={() => refetch()} />}
      />

      <PageSection title="阅读状态" description="按状态快速过滤">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread' | 'favorites')}>
          <TabsList className="rounded-full bg-white/60 p-1">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="unread">未读</TabsTrigger>
            <TabsTrigger value="favorites">收藏</TabsTrigger>
          </TabsList>
        </Tabs>

        {isPending ? (
          <div className="text-center py-12 theme-text-secondary">加载中...</div>
        ) : isError ? (
          <div className="text-center py-12 space-y-2">
            <p className="theme-text-secondary">无法加载资讯。</p>
            <Button variant="link" className="h-auto p-0" onClick={() => refetch()}>
              重试
            </Button>
            {error instanceof Error && (
              <p className="text-xs theme-text-tertiary">{error.message}</p>
            )}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 theme-text-secondary">
            暂无内容，先添加一条链接吧。
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <NewsCard key={item.id} item={item} queryKey={queryKey} />
            ))}
          </div>
        )}
      </PageSection>
    </div>
  )
}
