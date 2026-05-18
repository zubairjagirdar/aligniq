import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types/api'
import { Checkin } from '@/types'

export async function createCheckin(
  goalId: string,
  authorId: string,
  progress: number,
  notes?: string
): Promise<ApiResponse<Checkin>> {
  try {
    const goal = await prisma.goal.findUnique({ where: { id: goalId } })
    
    if (!goal) {
      return { success: false, error: 'Goal not found' }
    }

    // Validate progress value based on goal type
    if (progress < 0 || progress > 100) {
      return { success: false, error: 'Progress must be between 0 and 100' }
    }

    const checkin = await prisma.checkin.create({
      data: {
        goalId,
        authorId,
        progress,
        notes
      }
    })

    // Auto-update goal status
    if (progress === 100) {
      await prisma.goal.update({
        where: { id: goalId },
        data: { status: 'COMPLETED' }
      })
    } else if (progress > 0) {
      await prisma.goal.update({
        where: { id: goalId },
        data: { status: 'ON_TRACK' }
      })
    }

    // Log audit trail
    await prisma.auditLog.create({
      data: {
        actorId: authorId,
        entityType: 'Checkin',
        entityId: checkin.id,
        field: 'created',
        newValue: progress.toString()
      }
    })

    return { success: true, data: checkin }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getGoalCheckins(goalId: string): Promise<ApiResponse<Checkin[]>> {
  try {
    const checkins = await prisma.checkin.findMany({
      where: { goalId },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, data: checkins }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Calculate progress based on goal type
export function calculateProgress(
  currentValue: number,
  targetValue: number,
  type: 'MIN' | 'MAX' | 'ZERO' | 'TIMELINE'
): number {
  switch (type) {
    case 'MIN':
      // Higher is better
      return Math.min((currentValue / targetValue) * 100, 100)
    case 'MAX':
      // Lower is better
      return Math.max(((targetValue - currentValue) / targetValue) * 100, 0)
    case 'ZERO':
      // Zero is ideal
      return Math.max(((Math.abs(targetValue - currentValue) - Math.abs(currentValue)) / Math.abs(targetValue - currentValue)) * 100, 0)
    case 'TIMELINE':
      // Check if within deadline
      return currentValue > 0 ? 100 : 0
    default:
      return 0
  }
}
