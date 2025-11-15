'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // 发送到分析服务
    console.log('[Web Vitals]', metric.name, metric.value)
    
    // 可以发送到你的分析服务
    if (typeof window !== 'undefined') {
      // fetch('/api/analytics/vitals', {
      //   method: 'POST',
      //   body: JSON.stringify(metric),
      // })
    }
  })

  return null
}
