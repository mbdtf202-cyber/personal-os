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
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
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
    <div className="flex h-full w-72 flex-col border-r border-white/40 bg-white/60 px-6 py-8 text-slate-700 shadow-[0_30px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100">
      <div className="flex items-center gap-2 pb-10">
        <span className="text-2xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Personal OS
          </span>
        </span>
      </div>
      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-300',
                isActive
                  ? 'border-transparent bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 text-white shadow-[0_12px_30px_rgba(79,70,229,0.35)]'
                  : 'border-transparent text-slate-500 hover:border-white/70 hover:bg-white/80 hover:text-slate-900 dark:hover:border-white/10 dark:hover:bg-white/10'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 transition-colors duration-300',
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-300 dark:group-hover:text-white'
                )}
              />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
      <div className="mt-10 rounded-3xl border border-white/50 bg-white/70 p-4 text-xs text-slate-500 shadow-inner backdrop-blur-lg dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
        <p className="font-medium text-slate-600 dark:text-slate-100">Stay inspired</p>
        <p className="mt-1 leading-relaxed">
          Curate your life with clarity and focus. Every board reflects your personal operating rhythm.
        </p>
      </div>
    </div>
  )
}
