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
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex flex-1 items-center gap-4">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full"
              disabled={isSigningOut}
            >
              <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name ?? 'Unknown user'}</p>
                <p className="text-xs text-gray-500">{user?.email ?? 'Not signed in'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleSignOut}
              className="gap-2 text-red-600 focus:text-red-600"
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
