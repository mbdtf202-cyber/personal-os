import { create } from 'zustand'

interface UIState {
    isHealthDialogOpen: boolean
    isBookmarkDialogOpen: boolean
    isProjectDialogOpen: boolean
    isTradeDialogOpen: boolean
    isQuickNoteDialogOpen: boolean

    setHealthDialogOpen: (open: boolean) => void
    setBookmarkDialogOpen: (open: boolean) => void
    setProjectDialogOpen: (open: boolean) => void
    setTradeDialogOpen: (open: boolean) => void
    setQuickNoteDialogOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
    isHealthDialogOpen: false,
    isBookmarkDialogOpen: false,
    isProjectDialogOpen: false,
    isTradeDialogOpen: false,
    isQuickNoteDialogOpen: false,

    setHealthDialogOpen: (open) => set({ isHealthDialogOpen: open }),
    setBookmarkDialogOpen: (open) => set({ isBookmarkDialogOpen: open }),
    setProjectDialogOpen: (open) => set({ isProjectDialogOpen: open }),
    setTradeDialogOpen: (open) => set({ isTradeDialogOpen: open }),
    setQuickNoteDialogOpen: (open) => set({ isQuickNoteDialogOpen: open }),
}))
