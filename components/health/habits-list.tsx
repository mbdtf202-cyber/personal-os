'use client'

import { useState } from 'react'
import { format, startOfDay } from 'date-fns'
import { checkinHabit } from '@/lib/actions/health'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import type { Habit, HabitCheckin } from '@prisma/client'

interface HabitsListProps {
  habits: (Habit & { checkins: HabitCheckin[] })[]
}

export function HabitsList({ habits }: HabitsListProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckin = async (habitId: string) => {
    setLoading(habitId)
    try {
      const result = await checkinHabit({
        habitId,
        date: new Date(),
        done: true,
      })

      if (result.success) {
        toast.success('Habit checked in!')
      } else {
        toast.error(result.error || 'Failed to check in')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(null)
    }
  }

  const isCheckedInToday = (habit: Habit & { checkins: HabitCheckin[] }) => {
    const today = startOfDay(new Date())
    return habit.checkins.some(
      (c) => startOfDay(new Date(c.date)).getTime() === today.getTime() && c.done
    )
  }

  if (habits.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          No habits yet. Create your first habit to get started!
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {habits.map((habit) => {
        const checkedToday = isCheckedInToday(habit)
        const recentCheckins = habit.checkins.slice(0, 7)
        const completionRate = recentCheckins.length > 0
          ? (recentCheckins.filter(c => c.done).length / recentCheckins.length) * 100
          : 0

        return (
          <Card key={habit.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{habit.name}</CardTitle>
                <Badge variant={habit.frequencyType === 'DAILY' ? 'default' : 'secondary'}>
                  {habit.frequencyType}
                </Badge>
              </div>
              {habit.description && (
                <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>Target: {habit.targetTimesPerPeriod}x per {habit.frequencyType.toLowerCase()}</p>
                <p className="mt-1">Recent completion: {completionRate.toFixed(0)}%</p>
              </div>

              <Button
                onClick={() => handleCheckin(habit.id)}
                disabled={checkedToday || loading === habit.id}
                className="w-full"
                variant={checkedToday ? 'secondary' : 'default'}
              >
                {checkedToday ? '✓ Checked in today' : loading === habit.id ? 'Checking in...' : 'Check in'}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
