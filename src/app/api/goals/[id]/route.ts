import { NextResponse } from 'next/server'
import { getGoalById, updateGoalStatus } from '@/services/goalService'

// GET /api/goals/[id]
export async function GET(
  req: Request,
  context: any
) {
  try {
    const { params } = context
    const result = await getGoalById(params.id)
    return NextResponse.json(result, {
      status: result.success ? 200 : 404
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PATCH /api/goals/[id] - Update goal status
export async function PATCH(
  req: Request,
  context: any
) {
  try {
    const { params } = context
    const { status, actorId } = await req.json()

    if (!actorId) {
      return NextResponse.json(
        { success: false, error: 'actorId required' },
        { status: 400 }
      )
    }

    const result = await updateGoalStatus(params.id, status, actorId)
    return NextResponse.json(result, {
      status: result.success ? 200 : 404
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
