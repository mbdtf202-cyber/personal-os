'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

const PLATFORM_OPTIONS = [
  { value: 'XIAOHONGSHU', label: '小红书' },
  { value: 'X', label: 'X / Twitter' },
  { value: 'WECHAT', label: '微信公众号' },
  { value: 'OTHER', label: '其他平台' },
] as const

const STATUS_OPTIONS = [
  { value: 'IDEA', label: '创意' },
  { value: 'DRAFT', label: '草稿' },
  { value: 'SCHEDULED', label: '已排期' },
  { value: 'POSTED', label: '已发布' },
] as const

type PlatformOption = (typeof PLATFORM_OPTIONS)[number]['value']
type StatusOption = (typeof STATUS_OPTIONS)[number]['value']

export function CreateSocialPostDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [platform, setPlatform] = useState<PlatformOption>('XIAOHONGSHU')
  const [status, setStatus] = useState<StatusOption>('IDEA')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const title = formData.get('title') as string
    const contentText = formData.get('contentText') as string
    const url = (formData.get('url') as string) || undefined
    const plannedPublishTime = (formData.get('plannedPublishTime') as string) || undefined

    if (!title?.trim() || !contentText?.trim()) {
      toast.error('请填写完整内容')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          status,
          title: title.trim(),
          contentText: contentText.trim(),
          url: url?.trim(),
          plannedPublishTime: plannedPublishTime ? new Date(plannedPublishTime) : undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || '创建失败，请稍后重试')
      }

      toast.success('社媒内容已创建')
      event.currentTarget.reset()
      setStatus('IDEA')
      setPlatform('XIAOHONGSHU')
      setOpen(false)
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : '创建失败'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="theme-btn-primary">
          <Plus className="h-4 w-4" />
          <span className="ml-2">新增内容</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>创建社媒内容</DialogTitle>
          <DialogDescription>
            规划不同平台的发布内容，并可直接排期。
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>平台</Label>
              <Select value={platform} onValueChange={(value: PlatformOption) => setPlatform(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择平台" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORM_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>状态</Label>
              <Select value={status} onValueChange={(value: StatusOption) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <Input id="title" name="title" placeholder="例如：新品发布预热" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentText">内容</Label>
            <Textarea
              id="contentText"
              name="contentText"
              rows={5}
              placeholder="写下你想发布的文案或要点"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="plannedPublishTime">计划发布时间</Label>
              <Input id="plannedPublishTime" name="plannedPublishTime" type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">参考链接（可选）</Label>
              <Input id="url" name="url" placeholder="https://" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '提交中...' : '保存计划'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
