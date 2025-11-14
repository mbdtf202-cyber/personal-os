'use client'

import { useState } from 'react'
import { createHealthLog, updateHealthLog } from '@/lib/actions/health'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import type { HealthDailyLog } from '@prisma/client'

interface HealthLogFormProps {
  initialData?: HealthDailyLog | null
}

export function HealthLogForm({ initialData }: HealthLogFormProps) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      date: new Date(formData.get('date') as string),
      sleepHours: formData.get('sleepHours') ? parseFloat(formData.get('sleepHours') as string) : null,
      exerciseMinutes: formData.get('exerciseMinutes') ? parseInt(formData.get('exerciseMinutes') as string) : null,
      exerciseType: formData.get('exerciseType') as string || null,
      moodScore: formData.get('moodScore') ? parseInt(formData.get('moodScore') as string) : null,
      energyScore: formData.get('energyScore') ? parseInt(formData.get('energyScore') as string) : null,
      stressLevel: formData.get('stressLevel') ? parseInt(formData.get('stressLevel') as string) : null,
      remark: formData.get('remark') as string || null,
    }

    try {
      const result = initialData
        ? await updateHealthLog(initialData.id, data)
        : await createHealthLog(data)

      if (result.success) {
        toast.success(initialData ? 'Health log updated' : 'Health log created')
      } else {
        toast.error(result.error || 'Failed to save health log')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Update' : 'Add'} Health Log</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="date" value={today} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sleepHours">Sleep Hours</Label>
              <Input
                id="sleepHours"
                name="sleepHours"
                type="number"
                step="0.5"
                min="0"
                max="24"
                defaultValue={initialData?.sleepHours?.toString() || ''}
                placeholder="8"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exerciseMinutes">Exercise (minutes)</Label>
              <Input
                id="exerciseMinutes"
                name="exerciseMinutes"
                type="number"
                min="0"
                defaultValue={initialData?.exerciseMinutes?.toString() || ''}
                placeholder="30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exerciseType">Exercise Type</Label>
            <Input
              id="exerciseType"
              name="exerciseType"
              defaultValue={initialData?.exerciseType || ''}
              placeholder="Running, Gym, Yoga..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="moodScore">Mood (1-10)</Label>
              <Input
                id="moodScore"
                name="moodScore"
                type="number"
                min="1"
                max="10"
                defaultValue={initialData?.moodScore?.toString() || ''}
                placeholder="7"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="energyScore">Energy (1-10)</Label>
              <Input
                id="energyScore"
                name="energyScore"
                type="number"
                min="1"
                max="10"
                defaultValue={initialData?.energyScore?.toString() || ''}
                placeholder="7"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stressLevel">Stress (1-10)</Label>
              <Input
                id="stressLevel"
                name="stressLevel"
                type="number"
                min="1"
                max="10"
                defaultValue={initialData?.stressLevel?.toString() || ''}
                placeholder="5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remark">Remark</Label>
            <Textarea
              id="remark"
              name="remark"
              defaultValue={initialData?.remark || ''}
              placeholder="Any notes about today..."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Saving...' : initialData ? 'Update Log' : 'Save Log'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
