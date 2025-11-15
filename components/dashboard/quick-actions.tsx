// 快速操作面板
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { QuickLogDialog } from '@/components/health/quick-log-dialog'
import { QuickAddBookmarkDialog } from '@/components/bookmarks/quick-add-dialog'
import { QuickCreateProjectDialog } from '@/components/projects/quick-create-dialog'
import { QuickTradeDialog } from '@/components/trading/quick-trade-dialog'
import {
  FileText,
  Heart,
  Bookmark,
  FolderKanban,
  TrendingUp,
  GraduationCap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function QuickActions() {
  const router = useRouter()
  const [healthDialogOpen, setHealthDialogOpen] = useState(false)
  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState(false)
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false)

  const quickActions = [
    {
      name: '记录健康',
      icon: Heart,
      action: () => setHealthDialogOpen(true),
      color: 'from-rose-600 to-red-700',
    },
    {
      name: '写博客',
      icon: FileText,
      action: () => router.push('/blog/new'),
      color: 'from-emerald-600 to-teal-700',
    },
    {
      name: '添加书签',
      icon: Bookmark,
      action: () => setBookmarkDialogOpen(true),
      color: 'from-amber-500 to-yellow-600',
    },
    {
      name: '创建项目',
      icon: FolderKanban,
      action: () => setProjectDialogOpen(true),
      color: 'from-cyan-600 to-teal-700',
    },
    {
      name: '记录交易',
      icon: TrendingUp,
      action: () => setTradeDialogOpen(true),
      color: 'from-lime-600 to-green-700',
    },
    {
      name: '学习笔记',
      icon: GraduationCap,
      action: () => router.push('/training'),
      color: 'from-amber-600 to-orange-700',
    },
  ]

  return (
    <>
      <GlassCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold theme-text-primary mb-4">
            快速操作
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.name}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl glass-card transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
                onClick={action.action}
              >
                <div className="w-14 h-14 rounded-2xl theme-btn-primary flex items-center justify-center shadow-lg">
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium theme-text-primary">{action.name}</span>
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <QuickLogDialog
        open={healthDialogOpen}
        onOpenChange={setHealthDialogOpen}
        onSuccess={() => {
          setHealthDialogOpen(false)
          router.refresh()
        }}
      />

      <QuickAddBookmarkDialog
        open={bookmarkDialogOpen}
        onOpenChange={setBookmarkDialogOpen}
        onSuccess={() => {
          setBookmarkDialogOpen(false)
          router.refresh()
        }}
      />

      <QuickCreateProjectDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        onSuccess={() => {
          setProjectDialogOpen(false)
          router.refresh()
        }}
      />

      <QuickTradeDialog
        open={tradeDialogOpen}
        onOpenChange={setTradeDialogOpen}
        onSuccess={() => {
          setTradeDialogOpen(false)
          router.refresh()
        }}
      />
    </>
  )
}
