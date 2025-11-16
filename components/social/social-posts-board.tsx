'use client'

import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageSection } from '@/components/layout/page-section'
import { GlassCard } from '@/components/ui/glass-card'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CalendarCheck,
  Lightbulb,
  PencilLine,
  SendHorizontal,
} from 'lucide-react'

type SocialStatus = 'IDEA' | 'DRAFT' | 'SCHEDULED' | 'POSTED'

type SocialPost = {
  id: string
  title: string
  contentText: string
  platform: 'XIAOHONGSHU' | 'X' | 'WECHAT' | 'OTHER'
  status: SocialStatus
  plannedPublishTime?: string | Date | null
  url?: string | null
  tags: { id: string; name: string }[]
  stats: Array<{
    views: number
    likes: number
    comments: number
    shares: number
    collects: number
  }>
  createdAt: string | Date
}

const STATUS_LABELS: Record<SocialStatus, string> = {
  IDEA: '创意',
  DRAFT: '草稿',
  SCHEDULED: '已排期',
  POSTED: '已发布',
}

const PLATFORM_LABELS: Record<SocialPost['platform'], string> = {
  XIAOHONGSHU: '小红书',
  X: 'X / Twitter',
  WECHAT: '公众号',
  OTHER: '其他',
}

const statusOrder: SocialStatus[] = ['IDEA', 'DRAFT', 'SCHEDULED', 'POSTED']

interface SocialPostsBoardProps {
  posts: SocialPost[]
}

export function SocialPostsBoard({ posts }: SocialPostsBoardProps) {
  const [items, setItems] = useState(posts)
  const [statusFilter, setStatusFilter] = useState<'ALL' | SocialStatus>('ALL')
  const [platformFilter, setPlatformFilter] = useState<'ALL' | SocialPost['platform']>('ALL')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const visiblePosts = useMemo(() => {
    return items.filter((post) => {
      const statusMatch = statusFilter === 'ALL' || post.status === statusFilter
      const platformMatch = platformFilter === 'ALL' || post.platform === platformFilter
      return statusMatch && platformMatch
    })
  }, [items, statusFilter, platformFilter])

  const metrics = useMemo(() => {
    return {
      total: items.length,
      ideas: items.filter((item) => item.status === 'IDEA').length,
      drafts: items.filter((item) => item.status === 'DRAFT').length,
      scheduled: items.filter((item) => item.status === 'SCHEDULED').length,
      posted: items.filter((item) => item.status === 'POSTED').length,
    }
  }, [items])

  async function handleStatusChange(id: string, status: SocialStatus) {
    try {
      setUpdatingId(id)
      const response = await fetch(`/api/social/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || '更新失败')
      }

      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
      toast.success('状态已更新')
    } catch (error) {
      const message = error instanceof Error ? error.message : '无法更新状态'
      toast.error(message)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <PageSection title="内容规划" description="分平台掌控创意、草稿、排期与发布的每一个环节">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="创意池" value={metrics.ideas} icon={Lightbulb} accent="iris" />
        <MetricCard label="草稿" value={metrics.drafts} icon={PencilLine} accent="sunset" />
        <MetricCard label="已排期" value={metrics.scheduled} icon={CalendarCheck} accent="mint" />
        <MetricCard label="已发布" value={metrics.posted} icon={SendHorizontal} accent="aqua" />
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {(['ALL', ...statusOrder] as const).map((status) => (
          <Button
            key={status}
            size="sm"
            variant={statusFilter === status ? 'default' : 'outline'}
            className={cn(
              'rounded-full px-4',
              statusFilter === status ? 'theme-btn-primary text-white' : 'theme-text-secondary'
            )}
            onClick={() => setStatusFilter(status)}
          >
            {status === 'ALL' ? '全部状态' : STATUS_LABELS[status]}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {(['ALL', ...Object.keys(PLATFORM_LABELS)] as const).map((platform) => (
          <Button
            key={platform}
            size="sm"
            variant={platformFilter === platform ? 'default' : 'outline'}
            className={cn(
              'rounded-full px-4',
              platformFilter === platform ? 'theme-btn-success text-white' : 'theme-text-secondary'
            )}
            onClick={() => setPlatformFilter(platform as any)}
          >
            {platform === 'ALL' ? '全部平台' : PLATFORM_LABELS[platform as SocialPost['platform']]}
          </Button>
        ))}
      </div>

      {visiblePosts.length === 0 ? (
        <div className="text-center py-12 theme-text-secondary">
          当前筛选下暂无内容。
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visiblePosts.map((post) => {
            const plannedTime = post.plannedPublishTime
              ? format(new Date(post.plannedPublishTime), 'MM-dd HH:mm')
              : null
            const stats = post.stats?.[0]

            return (
              <GlassCard key={post.id} className="p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge className="mb-2 uppercase tracking-wide" variant="secondary">
                        {PLATFORM_LABELS[post.platform]}
                      </Badge>
                      <p className="text-lg font-semibold theme-text-primary line-clamp-2">
                        {post.title}
                      </p>
                      <p className="mt-1 text-sm theme-text-secondary line-clamp-2">
                        {post.contentText}
                      </p>
                    </div>
                    <Select
                      value={post.status}
                      onValueChange={(value) => handleStatusChange(post.id, value as SocialStatus)}
                      disabled={updatingId === post.id}
                    >
                      <SelectTrigger className="w-36 rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOrder.map((status) => (
                          <SelectItem key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs theme-text-tertiary">
                    <span>创建于 {format(new Date(post.createdAt), 'yyyy-MM-dd')}</span>
                    {plannedTime && (
                      <>
                        <span>•</span>
                        <span>计划 {plannedTime}</span>
                      </>
                    )}
                    {post.url && (
                      <>
                        <span>•</span>
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="theme-color-primary hover:opacity-80"
                        >
                          查看原稿
                        </a>
                      </>
                    )}
                  </div>

                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full bg-white/60 px-3 py-1 text-xs theme-text-secondary dark:bg-white/5"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {stats && (
                    <div className="grid grid-cols-4 gap-2 text-center text-xs theme-text-secondary">
                      <div>
                        <p className="text-lg font-semibold theme-text-primary">{stats.views}</p>
                        <p>浏览</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold theme-text-primary">{stats.likes}</p>
                        <p>点赞</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold theme-text-primary">{stats.comments}</p>
                        <p>评论</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold theme-text-primary">{stats.shares}</p>
                        <p>分享</p>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}
    </PageSection>
  )
}

interface MetricCardProps {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  accent: 'iris' | 'mint' | 'sunset' | 'aqua'
}

function MetricCard({ label, value, icon: Icon, accent }: MetricCardProps) {
  const accentClasses: Record<MetricCardProps['accent'], string> = {
    iris: 'from-[#f5e8ff] to-[#d0c9ff]',
    mint: 'from-[#d4f8f2] to-[#e0f7ff]',
    sunset: 'from-[#ffe2d1] to-[#ffd9ec]',
    aqua: 'from-[#d7ecff] to-[#f1f5ff]',
  }

  return (
    <div className={cn('rounded-3xl p-5 text-sm', `bg-gradient-to-br ${accentClasses[accent]}`)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        <Icon className="h-6 w-6 text-slate-600" />
      </div>
    </div>
  )
}
