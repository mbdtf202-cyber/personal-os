import { requireAuth } from '@/lib/auth'
import { dashboardService } from '@/lib/services/dashboard'
import { DashboardCards } from '@/components/dashboard/dashboard-cards'
import { RecentActivity } from '@/components/dashboard/recent-activity'

export default async function DashboardPage() {
  const userId = await requireAuth()
  const overview = await dashboardService.getTodayOverview(userId)
  const activity = await dashboardService.getRecentActivity(userId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your overview for today.</p>
      </div>

      <DashboardCards overview={overview} />
      <RecentActivity activity={activity} />
    </div>
  )
}
