import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types/api'

// Escalation engine: automatically escalate pending items
export async function escalateGoal(
  goalId: string,
  reason: 'not_submitted' | 'approval_delayed' | 'update_incomplete'
): Promise<ApiResponse<void>> {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: { owner: true }
    })

    if (!goal) {
      return { success: false, error: 'Goal not found' }
    }

    // Create escalation record
    const escalation = await prisma.escalation.create({
      data: {
        goalId,
        level: 1
      }
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: goal.owner.id,
        type: 'escalation',
        payload: {
          goalId,
          reason,
          escalationId: escalation.id,
          message: `Your goal "${goal.title}" requires attention`
        }
      }
    })

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Check and escalate stale goals
export async function checkAndEscalateStale(): Promise<ApiResponse<number>> {
  try {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)

    // Find goals not updated in 2 weeks
    const staleGoals = await prisma.goal.findMany({
      where: {
        status: 'NOT_STARTED',
        updatedAt: { lt: twoWeeksAgo }
      }
    })

    let escalatedCount = 0
    for (const goal of staleGoals) {
      await escalateGoal(goal.id, 'not_submitted')
      escalatedCount++
    }

    return { success: true, data: escalatedCount }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Get escalations for admin dashboard
export async function getEscalations(resolved?: boolean): Promise<ApiResponse<any[]>> {
  try {
    const escalations = await prisma.escalation.findMany({
      where: resolved !== undefined ? { resolved } : undefined,
      include: {
        goal: {
          include: {
            owner: true
          }
        }
      },
      orderBy: { escalatedAt: 'desc' }
    })

    return { success: true, data: escalations }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function resolveEscalation(
  escalationId: string,
  actorId: string
): Promise<ApiResponse<void>> {
  try {
    await prisma.escalation.update({
      where: { id: escalationId },
      data: { resolved: true }
    })

    await prisma.auditLog.create({
      data: {
        actorId,
        entityType: 'Escalation',
        entityId: escalationId,
        field: 'resolved',
        newValue: 'true'
      }
    })

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
