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
      <div className="flex h-14 items-center gap-3 px-4 theme-border" style={{ borderBottomWidth: '1px' }}>
        <div className="w-8 h-8 rounded-lg theme-btn-primary flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-base font-semibold theme-text-primary">
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

      <nav className="flex-1 space-y-0.5 px-2 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'theme-bg-tertiary theme-text-primary'
                  : 'theme-text-secondary hover:theme-bg-tertiary hover:theme-text-primary active:scale-95'
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
      <div className="hidden md:flex relative h-full w-64 flex-col overflow-hidden theme-bg-secondary theme-border" style={{ borderRightWidth: '1px' }}>
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 z-50 md:hidden flex flex-col theme-bg-secondary theme-border" style={{ borderRightWidth: '1px' }}>
            <SidebarContent />
          </div>
        </>
      )}
    </>
  )
}
