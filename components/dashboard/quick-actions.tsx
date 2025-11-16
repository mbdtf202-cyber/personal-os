// 快速操作面板
'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Heart,
  Bookmark,
  FolderKanban,
  TrendingUp,
  GraduationCap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const QuickLogDialog = dynamic(
  () => import('@/components/health/quick-log-dialog').then((mod) => ({ default: mod.QuickLogDialog })),
  { ssr: false },
)
const QuickAddBookmarkDialog = dynamic(
  () => import('@/components/bookmarks/quick-add-dialog').then((mod) => ({ default: mod.QuickAddBookmarkDialog })),
  { ssr: false },
)
const QuickCreateProjectDialog = dynamic(
  () => import('@/components/projects/quick-create-dialog').then((mod) => ({ default: mod.QuickCreateProjectDialog })),
  { ssr: false },
)
const QuickTradeDialog = dynamic(
  () => import('@/components/trading/quick-trade-dialog').then((mod) => ({ default: mod.QuickTradeDialog })),
  { ssr: false },
)

export function QuickActions() {
  const router = useRouter()
  const [healthDialogOpen, setHealthDialogOpen] = useState(false)
  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState(false)
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false)

  const quickActions = useMemo(
    () => [
      {
        name: '记录健康',
        icon: Heart,
        hint: '15 秒完成',
        accent: 'from-rose-300/90 via-rose-400/80 to-rose-500/80',
        action: () => setHealthDialogOpen(true),
      },
      {
        name: '写博客',
        icon: FileText,
        hint: '捕捉灵感',
        accent: 'from-indigo-300/90 via-indigo-400/80 to-sky-400/80',
        action: () => router.push('/blog/new'),
      },
      {
        name: '添加书签',
        icon: Bookmark,
        hint: '随手收藏',
        accent: 'from-amber-300/90 via-orange-300/80 to-orange-400/80',
        action: () => setBookmarkDialogOpen(true),
      },
      {
        name: '创建项目',
        icon: FolderKanban,
        hint: '规划里程碑',
        accent: 'from-cyan-300/90 via-teal-300/80 to-emerald-400/80',
        action: () => setProjectDialogOpen(true),
      },
      {
        name: '记录交易',
        icon: TrendingUp,
        hint: '同步市场',
        accent: 'from-lime-300/90 via-emerald-300/80 to-green-400/80',
        action: () => setTradeDialogOpen(true),
      },
      {
        name: '学习笔记',
        icon: GraduationCap,
        hint: '巩固知识',
        accent: 'from-purple-300/90 via-purple-400/80 to-pink-400/80',
        action: () => router.push('/training'),
      },
    ],
    [router],
  )

  return (
    <>
      <GlassCard gradient="aqua">
        <div className="p-6">
          <div className="flex flex-col gap-2 mb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-600">Command Center</p>
              <h3 className="text-2xl font-semibold text-slate-800">快速操作</h3>
              <p className="text-sm text-slate-600/80">常用动作集中在一个面板，像 iOS 控制中心一样丝滑。</p>
            </div>
            <Button variant="ghost" className="text-slate-700 hover:text-slate-900" onClick={() => router.refresh()}>
              更新状态
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <button
                key={action.name}
                onClick={action.action}
                className={cn(
                  'flex items-center gap-4 rounded-[1.75rem] border border-white/50 bg-white/60 p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 dark:border-white/10 dark:bg-white/5',
                )}
              >
                <div
                  className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br text-white shadow-[0_18px_35px_rgba(14,165,233,0.35)]',
                    action.accent,
                  )}
                >
                  <action.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-800 dark:text-white">{action.name}</p>
                  <p className="text-sm text-slate-600/80">{action.hint}</p>
                </div>
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
