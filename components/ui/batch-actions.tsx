// 批量操作组件
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2, Archive, Tag, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface BatchActionsProps<T> {
  items: T[]
  selectedIds: Set<string>
  onSelectionChange: (ids: Set<string>) => void
  getId: (item: T) => string
  actions: Array<{
    label: string
    icon: React.ComponentType<{ className?: string }>
    onClick: (ids: string[]) => Promise<void>
    variant?: 'default' | 'destructive'
  }>
  className?: string
}

export function BatchActions<T>({
  items,
  selectedIds,
  onSelectionChange,
  getId,
  actions,
  className,
}: BatchActionsProps<T>) {
  const [loading, setLoading] = useState(false)

  const allSelected = items.length > 0 && items.every((item) => selectedIds.has(getId(item)))
  const someSelected = items.some((item) => selectedIds.has(getId(item)))

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(items.map(getId)))
    }
  }

  const handleAction = async (action: typeof actions[0]) => {
    if (selectedIds.size === 0) {
      toast.error('请先选择项目')
      return
    }

    setLoading(true)
    try {
      await action.onClick(Array.from(selectedIds))
      toast.success('操作成功')
      onSelectionChange(new Set())
    } catch (error) {
      toast.error('操作失败')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) return null

  return (
    <div className={cn('flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg', className)}>
      <div className="flex items-center gap-2">
        <Checkbox
          checked={allSelected}
          onCheckedChange={handleSelectAll}
          className={cn(someSelected && !allSelected && 'data-[state=checked]:bg-amber-500')}
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {selectedIds.size > 0 ? `已选择 ${selectedIds.size} 项` : '全选'}
        </span>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              size="sm"
              variant={action.variant || 'outline'}
              onClick={() => handleAction(action)}
              disabled={loading}
              className="gap-2"
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
