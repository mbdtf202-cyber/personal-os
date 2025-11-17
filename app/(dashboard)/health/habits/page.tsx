import { requirePageAuth } from '@/lib/auth'
import { healthService } from '@/lib/services/health'
import { HabitsList } from '@/components/health/habits-list'
import { CreateHabitDialog } from '@/components/health/create-habit-dialog'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function HabitsPage() {
  const { id: userId } = await requirePageAuth()
  const habits = await healthService.getHabits(userId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/health">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Habits</h1>
            <p className="text-gray-600 mt-1">Track your daily habits</p>
          </div>
        </div>
        <CreateHabitDialog />
      </div>

      <HabitsList habits={habits} />
    </div>
  )
}
