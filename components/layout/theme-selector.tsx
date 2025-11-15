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

type ThemeName = 'minimal-light' | 'soft-blue' | 'fresh-green' | 'elegant-purple' | 'warm-beige' | 'deep-dark'

const THEMES: Array<{
  id: ThemeName
  name: string
  description: string
  colors: { primary: string; secondary: string; accent: string }
}> = [
  {
    id: 'minimal-light',
    name: '极简白',
    description: '简洁明快',
    colors: { primary: '#007AFF', secondary: '#F5F5F5', accent: '#34C759' },
  },
  {
    id: 'soft-blue',
    name: '柔和蓝',
    description: '舒适专业',
    colors: { primary: '#0EA5E9', secondary: '#F1F5F9', accent: '#10B981' },
  },
  {
    id: 'fresh-green',
    name: '清新绿',
    description: '生机活力',
    colors: { primary: '#16A34A', secondary: '#F7FEF5', accent: '#22C55E' },
  },
  {
    id: 'elegant-purple',
    name: '优雅紫',
    description: '高端典雅',
    colors: { primary: '#A855F7', secondary: '#F5F3F9', accent: '#8B5CF6' },
  },
  {
    id: 'warm-beige',
    name: '温暖米',
    description: '温馨舒适',
    colors: { primary: '#D97706', secondary: '#FEF9F5', accent: '#B45309' },
  },
  {
    id: 'deep-dark',
    name: '深邃黑',
    description: '沉浸体验',
    colors: { primary: '#38BDF8', secondary: '#1E293B', accent: '#4ADE80' },
  },
]

export function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('minimal-light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = (localStorage.getItem('app-theme') as ThemeName) || 'minimal-light'
    setCurrentTheme(savedTheme)
    applyThemeToDOM(savedTheme)
  }, [])

  const handleThemeChange = (themeName: ThemeName) => {
    setCurrentTheme(themeName)
    localStorage.setItem('app-theme', themeName)
    applyThemeToDOM(themeName)
  }

  if (!mounted) {
    return null
  }

  const activeTheme = THEMES.find(t => t.id === currentTheme)

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
          {THEMES.map((theme) => (
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
