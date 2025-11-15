'use client'

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
} from 'lucide-react'

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

  return (
    <div className="relative flex h-full w-64 flex-col overflow-hidden theme-bg-secondary theme-border" style={{ borderRightWidth: '1px' }}>
      <div className="relative z-10 flex h-16 items-center gap-2 px-6 theme-border" style={{ borderBottomWidth: '1px' }}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl theme-btn-primary theme-shadow-md">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold theme-text-primary">
            Personal OS
          </h1>
          <p className="text-xs theme-text-tertiary">Your Digital Life</p>
        </div>
      </div>

      <nav className="relative z-10 flex-1 space-y-1 px-3 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'theme-bg-tertiary theme-text-primary theme-shadow-sm'
                  : 'theme-text-secondary hover:theme-bg-tertiary hover:theme-text-primary'
              )}
            >
              <div
                className={cn(
                  'relative flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200',
                  isActive ? 'theme-btn-primary theme-shadow-md' : 'theme-bg-tertiary'
                )}
              >
                <item.icon className={cn('h-4 w-4', isActive ? 'text-white' : 'theme-text-secondary')} />
              </div>

              <span className="relative">{item.name}</span>

              {isActive && <div className="absolute right-3 h-1.5 w-1.5 rounded-full theme-btn-primary" />}
            </Link>
          )
        })}
      </nav>


    </div>
  )
}
