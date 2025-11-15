'use client'

import { Button } from '@/components/ui/button'
import { GlobalSearch } from '@/components/layout/global-search'
import { ThemeSelector } from '@/components/layout/theme-selector'
import { NotificationCenter } from '@/components/notifications/notification-center'
import { Download } from 'lucide-react'

export function Header() {
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
    <header className="flex items-center justify-between rounded-2xl theme-bg-secondary px-4 py-3 border theme-border" style={{ borderWidth: '1px' }}>
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
          onClick={handleExport}
          title="导出数据"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
