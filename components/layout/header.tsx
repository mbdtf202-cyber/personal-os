'use client'

import { Button } from '@/components/ui/button'
import { GlobalSearch } from '@/components/layout/global-search'
import { ThemeSelector } from '@/components/layout/theme-selector'
import { NotificationCenter } from '@/components/notifications/notification-center'
import { Download } from 'lucide-react'

export function Header() {
  return (
    <header className="flex items-center justify-between rounded-[2rem] theme-border theme-bg-secondary px-6 py-4 theme-shadow-lg backdrop-blur-2xl" style={{ borderWidth: '1px' }}>
      <div className="flex flex-1 items-center gap-4">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-2">
        <ThemeSelector />
        <NotificationCenter />
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 rounded-xl theme-text-secondary hover:theme-text-primary"
          onClick={() => (window.location.href = '/api/export?format=json')}
          title="导出数据"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
