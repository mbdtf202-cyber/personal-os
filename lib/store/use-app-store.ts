// 全局应用状态管理
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  // UI 状态
  sidebarCollapsed: boolean
  theme: 'light' | 'dark' | 'system'
  
  // 用户偏好
  defaultView: string
  compactMode: boolean
  
  // 通知
  notifications: Array<{
    id: string
    type: 'info' | 'success' | 'warning' | 'error'
    title: string
    message: string
    timestamp: Date
    read: boolean
  }>
  
  // Actions
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setDefaultView: (view: string) => void
  toggleCompactMode: () => void
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // 初始状态
      sidebarCollapsed: false,
      theme: 'system',
      defaultView: 'dashboard',
      compactMode: false,
      notifications: [],
      
      // Actions
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      setTheme: (theme) => set({ theme }),
      
      setDefaultView: (view) => set({ defaultView: view }),
      
      toggleCompactMode: () => set((state) => ({ compactMode: !state.compactMode })),
      
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            read: false,
          },
          ...state.notifications,
        ].slice(0, 50), // 只保留最近50条
      })),
      
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      })),
      
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'personal-os-storage',
      partialize: (state) => ({
        theme: state.theme,
        defaultView: state.defaultView,
        compactMode: state.compactMode,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
)
