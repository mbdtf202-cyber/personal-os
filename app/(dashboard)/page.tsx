import { requireAuth } from '@/lib/auth'
import { dashboardService } from '@/lib/services/dashboard'
import { DashboardCards } from '@/components/dashboard/dashboard-cards'
import { RecentActivity } from '@/components/dashboard/recent-activity'

export default async function DashboardPage() {
  const userId = await requireAuth()
  const overview = await dashboardService.getTodayOverview(userId)
  const activity = await dashboardService.getRecentActivity(userId)

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-800 dark:text-white">
          Dashboard
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-300">
          Welcome back! Here’s your elegant overview for today.
        </p>
      </div>

      <DashboardCards overview={overview} />
      <RecentActivity activity={activity} />
    </div>
  )
}
