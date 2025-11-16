import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { HealthDailyLog } from '@prisma/client'

interface HealthLogsListProps {
  logs: HealthDailyLog[]
}

export function HealthLogsList({ logs }: HealthLogsListProps) {
  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center theme-text-secondary">
          No health logs yet
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <Card key={log.id}>
          <CardContent className="py-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-medium theme-text-primary">{format(new Date(log.date), 'MMM dd, yyyy')}</p>
                <div className="flex gap-2 text-sm theme-text-secondary">
                  {log.sleepHours && <span>💤 {log.sleepHours}h</span>}
                  {log.exerciseMinutes && <span>🏃 {log.exerciseMinutes}min</span>}
                  {log.moodScore && <span>😊 {log.moodScore}/10</span>}
                  {log.energyScore && <span>⚡ {log.energyScore}/10</span>}
                </div>
                {log.remark && (
                  <p className="text-sm theme-text-tertiary mt-2">{log.remark}</p>
                )}
              </div>
              {log.exerciseType && (
                <Badge variant="secondary">{log.exerciseType}</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
