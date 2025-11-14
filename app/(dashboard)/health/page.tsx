import { requireAuth } from '@/lib/auth'
import { healthService } from '@/lib/services/health'
import { subDays } from 'date-fns'
import { HealthLogForm } from '@/components/health/health-log-form'
import { HealthLogsList } from '@/components/health/health-logs-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function HealthPage() {
  const userId = await requireAuth()
  
  const endDate = new Date()
  const startDate = subDays(endDate, 30)
  
  const logs = await healthService.getHealthLogs(userId, startDate, endDate)
  const todayStatus = await healthService.getTodayHealthStatus(userId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Health</h1>
          <p className="text-gray-600 mt-1">Track your daily health and habits</p>
        </div>
        <Link href="/health/habits">
          <Button variant="outline">Manage Habits</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Today's Log</h2>
          <HealthLogForm initialData={todayStatus.log} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Logs</h2>
          <HealthLogsList logs={logs} />
        </div>
      </div>
    </div>
  )
}
