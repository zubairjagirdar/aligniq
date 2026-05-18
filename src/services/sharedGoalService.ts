import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types/api'
import { SharedGoal } from '@/types'

export async function createSharedGoal(
  title: string,
  targetValue: number,
  unit: string,
  userWeights: Record<string, number>, // userId -> weight
  description?: string
): Promise<ApiResponse<SharedGoal>> {
  try {
    // Validate total weight equals 100
    const totalWeight = Object.values(userWeights).reduce((a, b) => a + b, 0)
    
    if (Math.abs(totalWeight - 100) > 0.01) {
      return {
        success: false,
        error: 'Total weightage must equal 100%'
      }
    }

    // Validate each weight >= 10
    if (Object.values(userWeights).some(w => w < 10)) {
      return {
        success: false,
        error: 'Minimum weightage per user is 10%'
      }
    }

    const shared = await prisma.sharedGoal.create({
      data: {
        title,
        description,
        targetValue,
        unit,
        owners: {
          createMany: {
            data: Object.entries(userWeights).map(([userId, weight]) => ({
              userId,
              weight
            }))
          }
        }
      }
    })

    // Create linked goals for each owner
    for (const [userId, weight] of Object.entries(userWeights)) {
      await prisma.goal.create({
        data: {
          ownerId: userId,
          sharedGoalId: shared.id,
          title: `[SHARED] ${title}`,
          targetValue,
          unit,
          weight,
          type: 'MIN',
          status: 'NOT_STARTED'
        }
      })
    }

    return { success: true, data: shared }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getSharedGoal(sharedId: string): Promise<ApiResponse<SharedGoal>> {
  try {
    const shared = await prisma.sharedGoal.findUnique({
      where: { id: sharedId },
      include: { owners: true }
    })

    if (!shared) {
      return { success: false, error: 'Shared goal not found' }
    }

    return { success: true, data: shared as any }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Sync achievement updates across linked employees
export async function syncSharedGoalProgress(
  sharedId: string,
  averageProgress: number
): Promise<ApiResponse<void>> {
  try {
    const shared = await prisma.sharedGoal.findUnique({
      where: { id: sharedId },
      include: { owners: true }
    })

    if (!shared) {
      return { success: false, error: 'Shared goal not found' }
    }

    // Update all linked goals
    for (const owner of shared.owners) {
      const linkedGoal = await prisma.goal.findFirst({
        where: {
          sharedGoalId: sharedId,
          ownerId: owner.userId
        }
      })

      if (linkedGoal) {
        await prisma.goal.update({
          where: { id: linkedGoal.id },
          data: {
            // Sync progress based on average
            status: averageProgress >= 100 ? 'COMPLETED' : 'ON_TRACK'
          }
        })
      }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
