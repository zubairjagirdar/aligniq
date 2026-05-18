import { NextRequest, NextResponse } from 'next/server'
import { createGoal, getUserGoals, updateGoalStatus } from '@/services/goalService'

// POST /api/goals - Create goal
export async function POST(req: NextRequest) {
  try {
    const { userId, title, description, targetValue, unit, weight, type, startDate, endDate } = await req.json()

    const result = await createGoal(userId, {
      title,
      description,
      targetValue,
      unit,
      weight,
      type,
      startDate,
      endDate
    })

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

// GET /api/goals?userId=xxx - Get user goals
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId required' },
        { status: 400 }
      )
    }

    const result = await getUserGoals(userId)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
