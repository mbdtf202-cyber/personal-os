import { NextResponse } from 'next/server'
import { PerformanceMonitor } from '@/lib/performance'

export async function GET() {
  try {
    const monitor = PerformanceMonitor.getInstance()
    const metrics = monitor.getAllMetrics()

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      metrics,
      summary: {
        totalMetrics: Object.keys(metrics).length,
        slowQueries: Object.entries(metrics)
          .filter(([_, m]) => m.p95 > 1000)
          .map(([name, m]) => ({ name, p95: m.p95 })),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}
