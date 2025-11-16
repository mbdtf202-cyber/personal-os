import { requireAuth } from '@/lib/auth'
import { healthService } from '@/lib/services/health'
import { subDays } from 'date-fns'
import { HealthLogForm } from '@/components/health/health-log-form'
import { HealthLogsList } from '@/components/health/health-logs-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'

export default async function HealthPage() {
  const userId = await requireAuth()
  
  const endDate = new Date()
  const startDate = subDays(endDate, 30)
  
  const logs = await healthService.getHealthLogs(userId, startDate, endDate)
  const todayStatus = await healthService.getTodayHealthStatus(userId)

  return (
    <div className="space-y-8">
      <PageHeader
        title="健康轨迹"
        description="记录睡眠、运动、心情，形成属于你的健康面板。"
        accent="mint"
        actions={(
          <Link href="/health/habits">
            <Button variant="outline" className="rounded-full">
              管理习惯
            </Button>
          </Link>
        )}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <PageSection title="今日记录" description="快速补充今日的睡眠与运动">
          <HealthLogForm initialData={todayStatus.log} />
        </PageSection>

        <PageSection title="最近 30 天" description="健康趋势一目了然">
          <HealthLogsList logs={logs} />
        </PageSection>
      </div>
    </div>
  )
}
