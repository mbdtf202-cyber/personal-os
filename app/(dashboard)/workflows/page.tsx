'use client'

import { useState, useEffect } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { CreateWorkflowDialog } from '@/components/workflows/create-workflow-dialog'
import { WorkflowCard } from '@/components/workflows/workflow-card'
import { Plus, Sparkles, Zap, CheckCircle } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'

export default function WorkflowsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [workflows, setWorkflows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWorkflows()
  }, [])

  const loadWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows')
      if (response.ok) {
        const data = await response.json()
        setWorkflows(data.map((w: any) => ({
          ...w,
          steps: JSON.parse(w.steps),
          lastRun: w.lastRunAt ? new Date(w.lastRunAt) : null,
        })))
      }
    } catch (error) {
      console.error('Failed to load workflows:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWorkflow = async (workflow: any) => {
    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow),
      })
      if (response.ok) {
        await loadWorkflows()
        setCreateDialogOpen(false)
      }
    } catch (error) {
      console.error('Failed to create workflow:', error)
    }
  }

  const handleDeleteWorkflow = async (id: string) => {
    try {
      const response = await fetch(`/api/workflows/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        await loadWorkflows()
      }
    } catch (error) {
      console.error('Failed to delete workflow:', error)
    }
  }

  const handleRunWorkflow = async (id: string) => {
    try {
      const response = await fetch(`/api/workflows/${id}/run`, {
        method: 'POST',
      })
      if (response.ok) {
        await loadWorkflows()
      }
    } catch (error) {
      console.error('Failed to run workflow:', error)
    }
  }

  const stats = {
    total: workflows.length,
    active: workflows.filter(w => w.status === 'ACTIVE').length,
    totalRuns: workflows.reduce((sum, w) => sum + w.runCount, 0),
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold theme-text-primary mb-2">
            工作流
          </h1>
          <p className="theme-text-secondary">
            加载中...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="工作流"
        description="创建和管理你的自动化流程，实时掌握执行情况。"
        accent="iris"
        actions={(
          <Button onClick={() => setCreateDialogOpen(true)} className="theme-btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            创建工作流
          </Button>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl theme-btn-primary">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm theme-text-tertiary">总工作流</p>
                <p className="text-2xl font-bold theme-text-primary">{stats.total}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl theme-btn-success">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm theme-text-tertiary">活跃中</p>
                <p className="text-2xl font-bold theme-text-primary">{stats.active}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl theme-btn-warning">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm theme-text-tertiary">总执行次数</p>
                <p className="text-2xl font-bold theme-text-primary">{stats.totalRuns}</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold theme-text-primary">
          我的工作流
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map((workflow) => (
          <WorkflowCard
            key={workflow.id}
            workflow={workflow}
            onRun={handleRunWorkflow}
            onDelete={handleDeleteWorkflow}
          />
        ))}
      </div>

      {workflows.length === 0 && (
        <GlassCard>
          <div className="p-12 text-center">
            <Sparkles className="h-16 w-16 mx-auto mb-4 theme-text-tertiary" />
            <h3 className="text-lg font-semibold theme-text-primary mb-2">
              还没有工作流
            </h3>
            <p className="theme-text-secondary mb-6">
              创建你的第一个工作流，自动化日常任务
            </p>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="theme-btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              创建工作流
            </Button>
          </div>
        </GlassCard>
      )}

      <CreateWorkflowDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateWorkflow}
      />
    </div>
  )
}
