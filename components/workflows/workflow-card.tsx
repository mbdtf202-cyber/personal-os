'use client'

import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Trash2, Clock, CheckCircle, FileText } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface WorkflowCardProps {
  workflow: {
    id: string
    name: string
    description: string
    steps: string[]
    trigger: string
    status: string
    lastRun: Date | null
    runCount: number
  }
  onRun: (id: string) => void
  onDelete: (id: string) => void
}

export function WorkflowCard({ workflow, onRun, onDelete }: WorkflowCardProps) {
  const statusColors: Record<string, string> = {
    ACTIVE: 'theme-color-success',
    DRAFT: 'theme-text-tertiary',
    PAUSED: 'theme-color-warning',
  }

  const statusLabels: Record<string, string> = {
    ACTIVE: '活跃',
    DRAFT: '草稿',
    PAUSED: '暂停',
  }

  const triggerLabels: Record<string, string> = {
    manual: '手动触发',
    scheduled: '定时触发',
    event: '事件触发',
  }

  return (
    <GlassCard hover>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold theme-text-primary">
                {workflow.name}
              </h3>
              <Badge
                className={`text-xs ${statusColors[workflow.status]}`}
                variant="outline"
              >
                {statusLabels[workflow.status]}
              </Badge>
            </div>
            <p className="text-sm theme-text-secondary">
              {workflow.description}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm theme-text-tertiary">
            <FileText className="h-4 w-4" />
            <span>{workflow.steps.length} 个步骤</span>
          </div>
          <div className="flex items-center gap-2 text-sm theme-text-tertiary">
            <Clock className="h-4 w-4" />
            <span>{triggerLabels[workflow.trigger]}</span>
          </div>
          {workflow.lastRun && (
            <div className="flex items-center gap-2 text-sm theme-text-tertiary">
              <CheckCircle className="h-4 w-4" />
              <span>
                上次运行: {formatDistanceToNow(workflow.lastRun, { addSuffix: true, locale: zhCN })}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm theme-text-tertiary">
            <span>已执行 {workflow.runCount} 次</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4 theme-border" style={{ borderTopWidth: '1px' }}>
          <Button
            size="sm"
            onClick={() => onRun(workflow.id)}
            className="theme-btn-primary flex-1"
            disabled={workflow.status === 'DRAFT'}
          >
            <Play className="h-4 w-4 mr-2" />
            运行
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(workflow.id)}
            className="theme-border theme-text-secondary hover:theme-color-danger"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}
