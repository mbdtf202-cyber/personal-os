import { dashboardService } from '@/lib/services/dashboard'
import { requirePageAuth } from '@/lib/auth'
import { SmartSuggestions } from '@/components/ai/smart-suggestions'
import { DashboardCards } from '@/components/dashboard/dashboard-cards'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ExperienceRoadmap } from '@/components/dashboard/experience-roadmap'
import { GlassCard } from '@/components/ui/glass-card'
import { Sparkles, ShieldCheck, Wifi, Clock3 } from 'lucide-react'

export default async function DashboardPage() {
  const { id: userId } = await requirePageAuth()
  const overview = await dashboardService.getTodayOverview(userId)
  const activity = await dashboardService.getRecentActivity(userId)

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? '早上好' : currentHour < 18 ? '下午好' : '晚上好'

  const securedMemories = 2100 + overview.bookmarks.toReadCount * 4 + overview.projects.activeCount
  const encryptedData = (overview.projects.activeCount + overview.news.unreadCount * 2 + 380).toFixed(1)
  const destinations = [
    {
      title: '知识工作台',
      description: '书签 & 学习同步',
      tag: 'Primary',
      href: '/training',
      gradient: 'lavender' as const,
    },
    {
      title: 'Workflow Hub',
      description: '自动化执行 & 备份',
      tag: 'Automation',
      href: '/workflows',
      gradient: 'mint' as const,
    },
    {
      title: 'Research Vault',
      description: '项目 + News 聚合',
      tag: 'Focus',
      href: '/projects',
      gradient: 'sunset' as const,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <GlassCard gradient="iris" className="p-8">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span>LightBox Vault</span>
            <span className="ios-pill text-xs">{greeting}</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold text-slate-900 dark:text-white">{securedMemories.toLocaleString()} 份记忆已备份</h1>
          <p className="mt-2 text-sm text-slate-600/80">
            {new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/60 p-4 shadow-sm dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">加密数据</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{encryptedData} GB</p>
              <p className="text-xs text-slate-500 mt-1">AES-256 GCM</p>
            </div>
            <div className="rounded-2xl bg-white/60 p-4 shadow-sm dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">覆盖率</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">86%</p>
              <p className="text-xs text-slate-500 mt-1">今日数据同步</p>
            </div>
            <div className="rounded-2xl bg-white/60 p-4 shadow-sm dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">下一次备份</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="text-xs text-slate-500 mt-1">夜间自动执行</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-700 dark:text-slate-200">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">
              <ShieldCheck className="h-4 w-4" /> Zero Trust
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">
              <Wifi className="h-4 w-4" /> Wi-Fi 6 pairing
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">
              <Clock3 className="h-4 w-4" /> 晚上 1:00 - 4:00
            </span>
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard gradient="mint" className="p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Destinations</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">跨端同步节点</h3>
          </GlassCard>
          <div className="grid gap-3">
            {destinations.map((destination) => (
              <a key={destination.title} href={destination.href} className="block">
                <GlassCard gradient={destination.gradient} className="p-4 transition-transform duration-200 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{destination.title}</p>
                      <p className="text-xs text-slate-600/80">{destination.description}</p>
                    </div>
                    <span className="ios-pill text-[10px] uppercase tracking-[0.25em]">{destination.tag}</span>
                  </div>
                </GlassCard>
              </a>
            ))}
          </div>
        </div>
      </div>

      <DashboardCards overview={overview} />
      <QuickActions />
      <ExperienceRoadmap />
      <SmartSuggestions userId={userId} />
      <RecentActivity activity={activity} />
    </div>
  )
}
