'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface QuickLogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function QuickLogDialog({ open, onOpenChange, onSuccess }: QuickLogDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    sleepHours: '',
    exerciseMinutes: '',
    moodScore: '5',
    energyScore: '5',
    stressLevel: '3',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const sleepValue = formData.sleepHours ? parseFloat(formData.sleepHours) : null
      const exerciseValue = formData.exerciseMinutes ? parseInt(formData.exerciseMinutes) : null
      
      const response = await fetch('/api/health/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString(),
          sleepHours: sleepValue !== null && !Number.isNaN(sleepValue) ? sleepValue : null,
          exerciseMinutes: exerciseValue !== null && !Number.isNaN(exerciseValue) ? exerciseValue : null,
          moodScore: parseInt(formData.moodScore),
          energyScore: parseInt(formData.energyScore),
          stressLevel: parseInt(formData.stressLevel),
        }),
      })

      if (response.ok) {
        toast.success('健康数据已记录')
        onOpenChange(false)
        onSuccess?.()
        setFormData({
          sleepHours: '',
          exerciseMinutes: '',
          moodScore: '5',
          energyScore: '5',
          stressLevel: '3',
        })
      } else {
        toast.error('记录失败')
      }
    } catch (error) {
      toast.error('记录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>快速记录健康数据</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="sleepHours">睡眠时长（小时）</Label>
            <Input
              id="sleepHours"
              type="number"
              step="0.5"
              value={formData.sleepHours}
              onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
              placeholder="8"
            />
          </div>

          <div>
            <Label htmlFor="exerciseMinutes">运动时长（分钟）</Label>
            <Input
              id="exerciseMinutes"
              type="number"
              value={formData.exerciseMinutes}
              onChange={(e) => setFormData({ ...formData, exerciseMinutes: e.target.value })}
              placeholder="30"
            />
          </div>

          <div>
            <Label htmlFor="moodScore">心情评分（1-10）</Label>
            <Input
              id="moodScore"
              type="number"
              min="1"
              max="10"
              value={formData.moodScore}
              onChange={(e) => setFormData({ ...formData, moodScore: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="energyScore">精力评分（1-10）</Label>
            <Input
              id="energyScore"
              type="number"
              min="1"
              max="10"
              value={formData.energyScore}
              onChange={(e) => setFormData({ ...formData, energyScore: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="stressLevel">压力等级（1-10）</Label>
            <Input
              id="stressLevel"
              type="number"
              min="1"
              max="10"
              value={formData.stressLevel}
              onChange={(e) => setFormData({ ...formData, stressLevel: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? '记录中...' : '记录'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
