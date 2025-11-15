// 快速操作面板
'use client'

import { useState } from 'react'
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
      action: () => window.location.href = '/blog/new',
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
      action: () => window.location.href = '/training',
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
              <Button
                key={action.name}
                variant="outline"
                className={cn(
                  'h-auto flex-col gap-2 p-4',
                  'hover:shadow-lg transition-all duration-200',
                  'border-gray-200 dark:border-gray-700',
                  'hover:border-transparent'
                )}
                onClick={action.action}
              >
                <div className={cn(
                  'rounded-xl p-3 bg-gradient-to-br',
                  action.color
                )}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium">{action.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </GlassCard>

      <QuickLogDialog
        open={healthDialogOpen}
        onOpenChange={setHealthDialogOpen}
        onSuccess={() => window.location.reload()}
      />

      <QuickAddBookmarkDialog
        open={bookmarkDialogOpen}
        onOpenChange={setBookmarkDialogOpen}
        onSuccess={() => window.location.reload()}
      />

      <QuickCreateProjectDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        onSuccess={() => window.location.reload()}
      />

      <QuickTradeDialog
        open={tradeDialogOpen}
        onOpenChange={setTradeDialogOpen}
        onSuccess={() => window.location.reload()}
      />
    </>
  )
}
