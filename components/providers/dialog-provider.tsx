'use client'

import dynamic from 'next/dynamic'
import { useUIStore } from '@/lib/store/ui-store'
import { useRouter } from 'next/navigation'

const QuickLogDialog = dynamic(
    () => import('@/components/health/quick-log-dialog').then((mod) => ({ default: mod.QuickLogDialog })),
    { ssr: false },
)
const QuickAddBookmarkDialog = dynamic(
    () => import('@/components/bookmarks/quick-add-dialog').then((mod) => ({ default: mod.QuickAddBookmarkDialog })),
    { ssr: false },
)
const QuickCreateProjectDialog = dynamic(
    () => import('@/components/projects/quick-create-dialog').then((mod) => ({ default: mod.QuickCreateProjectDialog })),
    { ssr: false },
)
const QuickTradeDialog = dynamic(
    () => import('@/components/trading/quick-trade-dialog').then((mod) => ({ default: mod.QuickTradeDialog })),
    { ssr: false },
)
const QuickNoteDialog = dynamic(
    () => import('@/components/quick-notes/quick-note-dialog').then((mod) => ({ default: mod.QuickNoteDialog })),
    { ssr: false },
)

export function DialogProvider() {
    const router = useRouter()
    const store = useUIStore()

    const handleSuccess = () => {
        router.refresh()
    }

    return (
        <>
            <QuickLogDialog
                open={store.isHealthDialogOpen}
                onOpenChange={store.setHealthDialogOpen}
                onSuccess={() => {
                    store.setHealthDialogOpen(false)
                    handleSuccess()
                }}
            />

            <QuickAddBookmarkDialog
                open={store.isBookmarkDialogOpen}
                onOpenChange={store.setBookmarkDialogOpen}
                onSuccess={() => {
                    store.setBookmarkDialogOpen(false)
                    handleSuccess()
                }}
            />

            <QuickCreateProjectDialog
                open={store.isProjectDialogOpen}
                onOpenChange={store.setProjectDialogOpen}
                onSuccess={() => {
                    store.setProjectDialogOpen(false)
                    handleSuccess()
                }}
            />

            <QuickTradeDialog
                open={store.isTradeDialogOpen}
                onOpenChange={store.setTradeDialogOpen}
                onSuccess={() => {
                    store.setTradeDialogOpen(false)
                    handleSuccess()
                }}
            />

            <QuickNoteDialog
                open={store.isQuickNoteDialogOpen}
                onOpenChange={store.setQuickNoteDialogOpen}
                onSuccess={() => {
                    store.setQuickNoteDialogOpen(false)
                    handleSuccess()
                }}
            />
        </>
    )
}
