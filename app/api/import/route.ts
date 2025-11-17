import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, UnauthorizedError } from '@/lib/auth'
import { dataImportService } from '@/lib/services/data-import'

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth()
    const data = await request.json()

    const results = await dataImportService.importFromJSON(userId, data)

    return NextResponse.json(results)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error('Import failed:', error)
    return NextResponse.json(
      { error: 'Import failed' },
      { status: 500 }
    )
  }
}
