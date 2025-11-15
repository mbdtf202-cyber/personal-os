'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, X } from 'lucide-react'

interface CreateWorkflowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (workflow: any) => void
}

export function CreateWorkflowDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateWorkflowDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [steps, setSteps] = useState<string[]>([''])
  const [trigger, setTrigger] = useState<'manual' | 'scheduled'>('manual')

  const handleAddStep = () => {
    setSteps([...steps, ''])
  }

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps]
    newSteps[index] = value
    setSteps(newSteps)
  }

  const handleSubmit = () => {
    const workflow = {
      name,
      description,
      steps: steps.filter(s => s.trim()),
      trigger,
      status: 'draft' as const,
      lastRun: null,
      runCount: 0,
    }
    onSuccess(workflow)
    setName('')
    setDescription('')
    setSteps([''])
    setTrigger('manual')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl theme-bg-secondary theme-border" style={{ borderWidth: '1px' }}>
        <DialogHeader>
          <DialogTitle className="theme-text-primary">创建工作流</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="theme-text-primary">
              工作流名称
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：晨间例行"
              className="theme-bg-tertiary theme-border theme-text-primary"
              style={{ borderWidth: '1px' }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="theme-text-primary">
              描述
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="描述这个工作流的用途..."
              className="theme-bg-tertiary theme-border theme-text-primary"
              style={{ borderWidth: '1px' }}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label className="theme-text-primary">触发方式</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="manual"
                  checked={trigger === 'manual'}
                  onChange={(e) => setTrigger(e.target.value as 'manual')}
                  className="theme-color-primary"
                />
                <span className="theme-text-secondary">手动触发</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="scheduled"
                  checked={trigger === 'scheduled'}
                  onChange={(e) => setTrigger(e.target.value as 'scheduled')}
                  className="theme-color-primary"
                />
                <span className="theme-text-secondary">定时触发</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="theme-text-primary">步骤</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddStep}
                className="theme-border theme-text-secondary"
              >
                <Plus className="h-4 w-4 mr-1" />
                添加步骤
              </Button>
            </div>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={step}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    placeholder={`步骤 ${index + 1}`}
                    className="theme-bg-tertiary theme-border theme-text-primary flex-1"
                    style={{ borderWidth: '1px' }}
                  />
                  {steps.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveStep(index)}
                      className="theme-border theme-text-secondary hover:theme-color-danger"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="theme-border theme-text-secondary"
            >
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!name || steps.filter(s => s.trim()).length === 0}
              className="theme-btn-primary"
            >
              创建
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
