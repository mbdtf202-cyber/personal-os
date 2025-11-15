import { dashboardService } from '@/lib/services/dashboard'
import { SmartSuggestions } from '@/components/ai/smart-suggestions'
import { DashboardCards } from '@/components/dashboard/dashboard-cards'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { Sparkles } from 'lucide-react'

const DEFAULT_USER_ID = 'local-user'

export default async function DashboardPage() {
  const userId = DEFAULT_USER_ID
  const overview = await dashboardService.getTodayOverview(userId)
  const activity = await dashboardService.getRecentActivity(userId)

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? '早上好' : currentHour < 18 ? '下午好' : '晚上好'

  return (
    <div className="space-y-6">
      <div className="rounded-2xl theme-bg-secondary p-6 border theme-border" style={{ borderWidth: '1px' }}>
        <h1 className="text-3xl font-semibold mb-1 theme-text-primary">{greeting}</h1>
        <p className="text-sm theme-text-tertiary">
          {new Date().toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}
        </p>
      </div>

      <DashboardCards overview={overview} />
      <QuickActions />
      <SmartSuggestions userId={userId} />
      <RecentActivity activity={activity} />
    </div>
  )
}
