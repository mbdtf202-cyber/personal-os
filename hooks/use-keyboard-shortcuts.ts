// 键盘快捷键 Hook
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ShortcutConfig {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  action: () => void
  description: string
}

const shortcuts: ShortcutConfig[] = [
  {
    key: 'k',
    meta: true,
    action: () => {
      // 搜索快捷键由 GlobalSearch 组件处理
    },
    description: '打开搜索',
  },
  {
    key: '1',
    meta: true,
    action: () => window.location.href = '/',
    description: '前往 Dashboard',
  },
  {
    key: '2',
    meta: true,
    action: () => window.location.href = '/training',
    description: '前往 Training',
  },
  {
    key: '3',
    meta: true,
    action: () => window.location.href = '/health',
    description: '前往 Health',
  },
  {
    key: '4',
    meta: true,
    action: () => window.location.href = '/blog',
    description: '前往 Blog',
  },
  {
    key: 'n',
    meta: true,
    shift: true,
    action: () => {
      const path = window.location.pathname
      if (path.includes('/blog')) {
        window.location.href = '/blog/new'
      } else if (path.includes('/projects')) {
        // 触发创建项目对话框
        document.dispatchEvent(new CustomEvent('create-project'))
      }
    },
    description: '创建新项目',
  },
  {
    key: 'e',
    meta: true,
    action: () => window.location.href = '/api/export?format=json',
    description: '导出数据',
  },
  {
    key: ',',
    meta: true,
    action: () => {
      // 打开设置
      document.dispatchEvent(new CustomEvent('open-settings'))
    },
    description: '打开设置',
  },
]

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const metaMatch = shortcut.meta ? (e.metaKey || e.ctrlKey) : true
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey : true
        const shiftMatch = shortcut.shift ? e.shiftKey : true
        const altMatch = shortcut.alt ? e.altKey : true
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()

        if (metaMatch && ctrlMatch && shiftMatch && altMatch && keyMatch) {
          // 排除搜索快捷键，因为它由 GlobalSearch 组件处理
          if (shortcut.key === 'k' && shortcut.meta) {
            continue
          }
          
          e.preventDefault()
          shortcut.action()
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return { shortcuts }
}

// 快捷键帮助组件
export function KeyboardShortcutsHelp() {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const modKey = isMac ? '⌘' : 'Ctrl'

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">键盘快捷键</h3>
      <div className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {shortcut.description}
            </span>
            <kbd className="inline-flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-2 py-1 font-mono text-xs">
              {shortcut.meta && <span>{modKey}</span>}
              {shortcut.shift && <span>⇧</span>}
              {shortcut.alt && <span>⌥</span>}
              <span>{shortcut.key.toUpperCase()}</span>
            </kbd>
          </div>
        ))}
      </div>
    </div>
  )
}
