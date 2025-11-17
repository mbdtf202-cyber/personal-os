'use client'

import { useEffect } from 'react'
import { applyThemeToDOM } from '@/lib/themes/apply-theme'
import { resolveThemeName } from '@/lib/themes/registry'

export function ThemeInitializer() {
  useEffect(() => {
    const storedTheme = localStorage.getItem('app-theme')
    const resolvedTheme = resolveThemeName(storedTheme)
    applyThemeToDOM(resolvedTheme)
  }, [])

  return null
}
