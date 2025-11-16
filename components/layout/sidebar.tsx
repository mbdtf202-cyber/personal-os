'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Heart,
  FileText,
  Newspaper,
  Share2,
  TrendingUp,
  FolderKanban,
  Bookmark,
  GraduationCap,
  Sparkles,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Workflows', href: '/workflows', icon: Sparkles },
  { name: 'Training', href: '/training', icon: GraduationCap },
  { name: 'Health', href: '/health', icon: Heart },
  { name: 'Blog', href: '/blog', icon: FileText },
  { name: 'News', href: '/news', icon: Newspaper },
  { name: 'Social', href: '/social', icon: Share2 },
  { name: 'Trading', href: '/trading', icon: TrendingUp },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center gap-3 px-5 mb-4">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-400/90 to-blue-500/80 flex items-center justify-center shadow-[0_10px_30px_rgba(79,70,229,0.35)]">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold theme-text-primary">
            Personal OS
          </h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-white/80 via-white/60 to-white/30 text-slate-900 shadow-[0_15px_35px_rgba(79,70,229,0.18)] dark:from-white/10 dark:via-white/5 dark:to-white/0 dark:text-white'
                  : 'theme-text-secondary hover:bg-white/40 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden theme-bg-secondary theme-border"
        onClick={() => setMobileOpen(true)}
        style={{ borderWidth: '1px' }}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Desktop sidebar */}
      <div className="hidden md:flex relative h-full w-64 flex-col overflow-hidden glass-card m-4 rounded-[2rem]">
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 z-50 md:hidden flex flex-col glass-card m-4 rounded-[2rem]">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  )
}
