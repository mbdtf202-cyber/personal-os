// 数据同步 Hook
import { useEffect, useCallback } from 'react'
import { useAppStore } from '@/lib/store/use-app-store'

export function useDataSync() {
  const addNotification = useAppStore((state) => state.addNotification)

  const syncData = useCallback(async () => {
    try {
      const response = await fetch('/api/sync/check')
      if (response.ok) {
        const data = await response.json()
        if (data.hasUpdates) {
          addNotification({
            type: 'info',
            title: '数据已更新',
            message: '检测到新数据，页面将自动刷新',
          })
          setTimeout(() => window.location.reload(), 2000)
        }
      }
    } catch (error) {
      console.error('Sync check failed:', error)
    }
  }, [addNotification])

  useEffect(() => {
    // 每30秒检查一次更新
    const interval = setInterval(syncData, 30000)
    return () => clearInterval(interval)
  }, [syncData])

  return { syncData }
}
