'use client'

import { useState } from 'react'
import { Plus, Heart, FileText, Bookmark, TrendingUp, NotebookPen, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/lib/store/ui-store'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export function MobileFAB() {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const {
        setHealthDialogOpen,
        setBookmarkDialogOpen,
        setTradeDialogOpen,
        setQuickNoteDialogOpen
    } = useUIStore()

    const actions = [
        {
            icon: Heart,
            label: 'Health',
            color: 'bg-rose-500',
            onClick: () => setHealthDialogOpen(true),
        },
        {
            icon: NotebookPen,
            label: 'Note',
            color: 'bg-orange-500',
            onClick: () => setQuickNoteDialogOpen(true),
        },
        {
            icon: TrendingUp,
            label: 'Trade',
            color: 'bg-emerald-500',
            onClick: () => setTradeDialogOpen(true),
        },
        {
            icon: Bookmark,
            label: 'Save',
            color: 'bg-amber-500',
            onClick: () => setBookmarkDialogOpen(true),
        },
    ]

    return (
        <div className="fixed bottom-6 right-6 z-50 md:hidden">
            <div className={cn(
                "absolute bottom-16 right-0 flex flex-col gap-3 transition-all duration-200",
                open ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
            )}>
                {actions.map((action, index) => (
                    <div key={index} className="flex items-center justify-end gap-2">
                        <span className="bg-black/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                            {action.label}
                        </span>
                        <Button
                            size="icon"
                            className={cn("rounded-full shadow-lg h-10 w-10", action.color)}
                            onClick={() => {
                                action.onClick()
                                setOpen(false)
                            }}
                        >
                            <action.icon className="h-5 w-5 text-white" />
                        </Button>
                    </div>
                ))}
            </div>

            <Button
                size="icon"
                className={cn(
                    "h-14 w-14 rounded-full shadow-xl transition-transform duration-200",
                    open ? "rotate-45 bg-slate-900" : "bg-blue-600 hover:bg-blue-700"
                )}
                onClick={() => setOpen(!open)}
            >
                <Plus className="h-6 w-6 text-white" />
            </Button>
        </div>
    )
}
