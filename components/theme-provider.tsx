// 主题提供者
'use client'

import { useEffect } from 'react'
import { getTheme, applyTheme } from '@/lib/theme-manager'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'minimal-light'
    const theme = getTheme(saved)
    applyTheme(theme)
  }, [])

  return <>{children}</>
}
