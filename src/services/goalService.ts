import { prisma } from '@/lib/prisma'
import { CreateGoalPayload, ApiResponse } from '@/types/api'
import { Goal, GoalStatus } from '@/types'

// Create goal for employee
export async function createGoal(
  userId: string,
  payload: CreateGoalPayload
): Promise<ApiResponse<Goal>> {
  try {
    // Validate weightage constraints
    const existingGoals = await prisma.goal.findMany({
      where: { ownerId: userId, status: { not: 'COMPLETED' } }
    })

    const currentTotalWeight = existingGoals.reduce((sum, g) => sum + g.weight, 0)
    
    if (currentTotalWeight + payload.weight > 100) {
      return {
        success: false,
        error: 'Total weightage cannot exceed 100%'
      }
    }

    if (payload.weight < 10) {
      return {
        success: false,
        error: 'Minimum individual weightage is 10%'
      }
    }

    if (existingGoals.length >= 8) {
      return {
        success: false,
        error: 'Maximum 8 goals per employee'
      }
    }

    const goal = await prisma.goal.create({
      data: {
        ownerId: userId,
        title: payload.title,
        description: payload.description,
        targetValue: payload.targetValue,
        unit: payload.unit,
        weight: payload.weight,
        type: payload.type,
        startDate: payload.startDate ? new Date(payload.startDate) : undefined,
        endDate: payload.endDate ? new Date(payload.endDate) : undefined
      }
    })

    // Log audit trail
    await prisma.auditLog.create({
      data: {
        actorId: userId,
        entityType: 'Goal',
        entityId: goal.id,
        field: 'created',
        newValue: goal.id
      }
    })

    return { success: true, data: goal }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Get goals for user
export async function getUserGoals(userId: string): Promise<ApiResponse<Goal[]>> {
  try {
    const goals = await prisma.goal.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, data: goals }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Get goal by ID
export async function getGoalById(goalId: string): Promise<ApiResponse<Goal>> {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId }
    })
    
    if (!goal) {
      return { success: false, error: 'Goal not found' }
    }

    return { success: true, data: goal }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Update goal status
export async function updateGoalStatus(
  goalId: string,
  status: GoalStatus,
  actorId: string
): Promise<ApiResponse<Goal>> {
  try {
    const existing = await prisma.goal.findUnique({ where: { id: goalId } })
    
    if (!existing) {
      return { success: false, error: 'Goal not found' }
    }

    const updated = await prisma.goal.update({
      where: { id: goalId },
      data: { status }
    })

    await prisma.auditLog.create({
      data: {
        actorId,
        entityType: 'Goal',
        entityId: goalId,
        field: 'status',
        oldValue: existing.status,
        newValue: status
      }
    })

    return { success: true, data: updated }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Approve goal (manager action)
export async function approveGoal(
  goalId: string,
  approved: boolean,
  managerId: string,
  comment?: string
): Promise<ApiResponse<Goal>> {
  try {
    const goal = await prisma.goal.findUnique({ where: { id: goalId } })
    
    if (!goal) {
      return { success: false, error: 'Goal not found' }
    }

    const updated = await prisma.goal.update({
      where: { id: goalId },
      data: { status: approved ? 'ON_TRACK' : 'NOT_STARTED' }
    })

    await prisma.auditLog.create({
      data: {
        actorId: managerId,
        entityType: 'Goal',
        entityId: goalId,
        field: 'approval',
        oldValue: 'pending',
        newValue: approved ? 'approved' : 'rejected'
      }
    })

    return { success: true, data: updated }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
