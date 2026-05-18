import { NextRequest, NextResponse } from 'next/server'
import { getAuditTrail, getActivityFeed, getComplianceReport } from '@/services/auditService'

// GET /api/audit?entityId=xxx or /api/audit?action=feed
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const entityId = searchParams.get('entityId')
    const action = searchParams.get('action')

    if (action === 'feed') {
      const result = await getActivityFeed()
      return NextResponse.json(result)
    }

    if (entityId) {
      const result = await getAuditTrail(entityId)
      return NextResponse.json(result)
    }

    return NextResponse.json(
      { success: false, error: 'entityId or action required' },
      { status: 400 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/audit/compliance
export async function POST(req: NextRequest) {
  try {
    const { startDate, endDate } = await req.json()

    const result = await getComplianceReport(
      new Date(startDate),
      new Date(endDate)
    )

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
