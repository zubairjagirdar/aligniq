import { NextRequest, NextResponse } from 'next/server'
import { predictGoalRisk, generateQuarterlySummary, analyzeTrends } from '@/services/aiService'

// GET /api/ai/risk?goalId=xxx
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const goalId = searchParams.get('goalId')
    const action = searchParams.get('action')

    if (!goalId) {
      return NextResponse.json(
        { success: false, error: 'goalId required' },
        { status: 400 }
      )
    }

    if (action === 'risk') {
      const result = await predictGoalRisk(goalId)
      return NextResponse.json(result)
    }

    return NextResponse.json(
      { success: false, error: 'action not found' },
      { status: 404 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/ai/summary - Generate quarterly summary
export async function POST(req: NextRequest) {
  try {
    const { userId, action } = await req.json()

    if (action === 'summary') {
      const result = await generateQuarterlySummary(userId)
      return NextResponse.json(result)
    }

    if (action === 'trends') {
      const result = await analyzeTrends(userId)
      return NextResponse.json(result)
    }

    return NextResponse.json(
      { success: false, error: 'action not recognized' },
      { status: 400 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
