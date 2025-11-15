'use client'

import { useEffect } from 'react'
import { applyThemeToDOM } from '@/lib/themes/apply-theme'

export function ThemeInitializer() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'minimal-light'
    applyThemeToDOM(savedTheme)
  }, [])

  return null
}
