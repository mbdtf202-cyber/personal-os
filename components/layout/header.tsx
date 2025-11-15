'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { GlobalSearch } from '@/components/layout/global-search'
import { LogOut, User } from 'lucide-react'
import { toast } from 'sonner'
import type { AuthenticatedUser } from '@/lib/auth'

interface HeaderProps {
  user: AuthenticatedUser | null
}

export function Header({ user }: HeaderProps) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'NA'

  async function handleSignOut() {
    setIsSigningOut(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to sign out')
      }

      toast.success('Signed out')
      router.push('/auth/signin')
      router.refresh()
    } catch (error) {
      console.error('Failed to sign out:', error)
      toast.error('Unable to sign out')
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <header className="flex items-center justify-between rounded-[2rem] border border-white/50 bg-white/70 px-6 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.1)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/60">
      <div className="flex flex-1 items-center gap-4">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-12 w-12 rounded-full border border-white/70 bg-white/80 shadow-[0_10px_30px_rgba(79,70,229,0.2)] transition-all hover:scale-[1.02] hover:shadow-[0_18px_40px_rgba(79,70,229,0.25)] dark:border-white/10 dark:bg-slate-900/60"
              disabled={isSigningOut}
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-sky-400 to-indigo-500 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-3xl border-white/60 bg-white/80 p-4 shadow-[0_30px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/80">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-slate-700 dark:text-white">{user?.name ?? 'Unknown user'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-300">{user?.email ?? 'Not signed in'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem className="gap-2 rounded-2xl px-3 py-2 text-slate-600 transition hover:bg-white/80 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-white/10">
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleSignOut}
              className="gap-2 rounded-2xl px-3 py-2 text-rose-500 transition hover:bg-rose-50/80 hover:text-rose-600 focus:text-rose-600 dark:text-rose-400 dark:hover:bg-rose-500/20"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
