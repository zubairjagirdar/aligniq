import { NextRequest, NextResponse } from 'next/server'
import { createCheckin, getGoalCheckins } from '@/services/checkinService'

// POST /api/checkins - Create checkin
export async function POST(req: NextRequest) {
  try {
    const { goalId, authorId, progress, notes } = await req.json()

    const result = await createCheckin(goalId, authorId, progress, notes)
    return NextResponse.json(result, {
      status: result.success ? 201 : 400
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// GET /api/checkins?goalId=xxx
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const goalId = searchParams.get('goalId')

    if (!goalId) {
      return NextResponse.json(
        { success: false, error: 'goalId required' },
        { status: 400 }
      )
    }

    const result = await getGoalCheckins(goalId)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
