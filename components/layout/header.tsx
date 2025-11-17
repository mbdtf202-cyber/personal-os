'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GlobalSearch } from '@/components/layout/global-search'
import { ThemeSelector } from '@/components/layout/theme-selector'
import { NotificationCenter } from '@/components/notifications/notification-center'
import { Download, NotebookPen } from 'lucide-react'
import { QuickNoteDialog } from '@/components/quick-notes/quick-note-dialog'

export function Header() {
  const [quickNoteOpen, setQuickNoteOpen] = useState(false)
  const handleExport = async () => {
    try {
      const response = await fetch('/api/export?format=json')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `personal-os-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  return (
    <header className="flex flex-col gap-3 rounded-[2.25rem] glass-card soft-shadow px-6 py-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="ios-pill hidden items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 lg:flex dark:text-slate-300">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Sync up to date
          </div>
          <GlobalSearch />
        </div>

        <div className="flex items-center gap-2">
          <ThemeSelector />
          <NotificationCenter />
          <Button
            variant="secondary"
            size="sm"
            className="h-10 rounded-2xl bg-white/80 text-slate-700 shadow-sm hover:bg-white dark:bg-white/10 dark:text-white"
            onClick={() => setQuickNoteOpen(true)}
          >
            <NotebookPen className="h-4 w-4" />
            <span className="hidden sm:inline">随手记</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-2xl bg-white/70 text-slate-700 shadow-sm hover:bg-white/90 dark:bg-white/10 dark:text-white"
            onClick={handleExport}
            title="导出数据"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">导出</span>
          </Button>
        </div>
      </div>
      <QuickNoteDialog open={quickNoteOpen} onOpenChange={setQuickNoteOpen} />
    </header>
  )
}
