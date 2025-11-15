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
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl theme-bg-secondary p-8 theme-text-primary shadow-2xl theme-border" style={{ borderWidth: '1px' }}>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 theme-color-primary" />
            <span className="text-sm font-medium theme-text-secondary">Personal OS</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 theme-text-primary">{greeting}！</h1>
          <p className="text-lg theme-text-secondary">
            今天是 {new Date().toLocaleDateString('zh-CN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </p>
        </div>
      </div>

      <DashboardCards overview={overview} />
      <QuickActions />
      <SmartSuggestions userId={userId} />
      <RecentActivity activity={activity} />
    </div>
  )
}
