'use client'

import { useEffect, useState } from 'react'
import { Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { applyThemeToDOM } from '@/lib/themes/apply-theme'
import { DEFAULT_THEME, THEME_CHANGE_EVENT, ThemeName, resolveThemeName, themeOptions } from '@/lib/themes/registry'

export function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(DEFAULT_THEME)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = resolveThemeName(localStorage.getItem('app-theme'))
    setCurrentTheme(savedTheme)
    applyThemeToDOM(savedTheme)
  }, [])

  useEffect(() => {
    const handleThemeBroadcast = (event: Event) => {
      const detail = (event as CustomEvent<ThemeName>).detail
      if (detail) {
        setCurrentTheme(detail)
      }
    }

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeBroadcast as EventListener)
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeBroadcast as EventListener)
  }, [])

  const handleThemeChange = (themeName: ThemeName) => {
    setCurrentTheme(themeName)
    localStorage.setItem('app-theme', themeName)
    applyThemeToDOM(themeName)
  }

  if (!mounted) {
    return null
  }

  const themes = themeOptions
  const activeTheme = themes.find(t => t.id === currentTheme)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 rounded-xl"
          title="切换主题"
        >
          <Palette className="h-4 w-4" />
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-3 theme-bg-secondary theme-border" style={{ borderWidth: '1px' }}>
        <div className="mb-3 px-2 py-1">
          <h3 className="text-sm font-semibold theme-text-primary">
            选择主题
          </h3>
          <p className="text-xs theme-text-tertiary mt-0.5">
            当前: {activeTheme?.name}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={cn(
                'relative p-3 rounded-lg transition-all theme-border',
                currentTheme === theme.id
                  ? 'theme-bg-tertiary theme-shadow-sm'
                  : 'theme-bg-secondary hover:theme-bg-tertiary'
              )}
              style={{ borderWidth: '2px' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>
                {currentTheme === theme.id && (
                  <div className="ml-auto w-4 h-4 rounded-full theme-btn-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
              <div className="text-left">
                <p className="text-xs font-medium theme-text-primary">
                  {theme.name}
                </p>
                <p className="text-xs theme-text-tertiary">
                  {theme.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
