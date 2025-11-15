// 高级筛选组件
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Filter, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterField {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'number'
  options?: Array<{ value: string; label: string }>
}

interface AdvancedFilterProps {
  fields: FilterField[]
  onApply: (filters: Record<string, any>) => void
  className?: string
}

export function AdvancedFilter({ fields, onApply, className }: AdvancedFilterProps) {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})

  const handleApply = () => {
    setActiveFilters(filters)
    onApply(filters)
    setOpen(false)
  }

  const handleClear = () => {
    setFilters({})
    setActiveFilters({})
    onApply({})
  }

  const activeCount = Object.keys(activeFilters).filter(
    (key) => activeFilters[key] !== undefined && activeFilters[key] !== ''
  ).length

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            筛选
            {activeCount > 0 && (
              <span className="ml-1 rounded-full bg-amber-500 px-2 py-0.5 text-xs text-white">
                {activeCount}
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>高级筛选</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.key}>
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.type === 'text' && (
                  <Input
                    id={field.key}
                    value={filters[field.key] || ''}
                    onChange={(e) =>
                      setFilters({ ...filters, [field.key]: e.target.value })
                    }
                    placeholder={`输入${field.label}`}
                  />
                )}
                {field.type === 'select' && (
                  <select
                    id={field.key}
                    value={filters[field.key] || ''}
                    onChange={(e) =>
                      setFilters({ ...filters, [field.key]: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
                  >
                    <option value="">全部</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                {field.type === 'date' && (
                  <Input
                    id={field.key}
                    type="date"
                    value={filters[field.key] || ''}
                    onChange={(e) =>
                      setFilters({ ...filters, [field.key]: e.target.value })
                    }
                  />
                )}
                {field.type === 'number' && (
                  <Input
                    id={field.key}
                    type="number"
                    value={filters[field.key] || ''}
                    onChange={(e) =>
                      setFilters({ ...filters, [field.key]: e.target.value })
                    }
                    placeholder={`输入${field.label}`}
                  />
                )}
              </div>
            ))}
            <div className="flex gap-2">
              <Button onClick={handleApply} className="flex-1">
                应用筛选
              </Button>
              <Button onClick={handleClear} variant="outline">
                清除
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value) return null
            const field = fields.find((f) => f.key === key)
            if (!field) return null

            return (
              <div
                key={key}
                className="flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/20 px-3 py-1 text-sm"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {field.label}: {value}
                </span>
                <button
                  onClick={() => {
                    const newFilters = { ...activeFilters }
                    delete newFilters[key]
                    setActiveFilters(newFilters)
                    setFilters(newFilters)
                    onApply(newFilters)
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
