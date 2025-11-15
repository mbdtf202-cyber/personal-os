import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { dataExportService } from '@/lib/services/data-export'

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth()
    const searchParams = request.nextUrl.searchParams
    
    const format = (searchParams.get('format') || 'json') as 'json' | 'csv' | 'markdown'
    const modules = searchParams.get('modules')?.split(',')
    
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const dateRange = startDate && endDate
      ? { start: new Date(startDate), end: new Date(endDate) }
      : undefined

    const data = await dataExportService.exportAllData(userId, {
      format,
      modules,
      dateRange,
    })

    if (format === 'json') {
      return NextResponse.json(data, {
        headers: {
          'Content-Disposition': `attachment; filename="personal-os-export-${Date.now()}.json"`,
        },
      })
    }

    if (format === 'markdown') {
      const markdown = dataExportService.toMarkdown(data, 'Personal OS 数据导出')
      return new NextResponse(markdown, {
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': `attachment; filename="personal-os-export-${Date.now()}.md"`,
        },
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Export failed:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
