import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types/api'

// Immutable audit log creation
export async function logAudit(
  actorId: string,
  entityType: string,
  entityId: string,
  field: string,
  oldValue?: string,
  newValue?: string
): Promise<ApiResponse<void>> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId,
        entityType,
        entityId,
        field,
        oldValue,
        newValue
      }
    })
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Get audit trail for an entity
export async function getAuditTrail(entityId: string): Promise<ApiResponse<any[]>> {
  try {
    const logs = await prisma.auditLog.findMany({
      where: { entityId },
      include: { actor: { select: { name: true, email: true } } },
      orderBy: { timestamp: 'desc' }
    })

    return { success: true, data: logs }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Activity feed for dashboards
export async function getActivityFeed(limit: number = 50): Promise<ApiResponse<any[]>> {
  try {
    const activities = await prisma.activityLog.findMany({
      include: {
        user: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return { success: true, data: activities }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Log user activity
export async function logActivity(
  userId: string,
  action: string,
  meta?: Record<string, any>
): Promise<ApiResponse<void>> {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        meta
      }
    })
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Compliance report - who changed what
export async function getComplianceReport(
  startDate: Date,
  endDate: Date
): Promise<ApiResponse<any>> {
  try {
    const logs = await prisma.auditLog.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      include: { actor: true },
      orderBy: { timestamp: 'asc' }
    })

    const grouped = logs.reduce((acc: any, log) => {
      const key = `${log.entityType}:${log.entityId}`
      if (!acc[key]) acc[key] = []
      acc[key].push(log)
      return acc
    }, {})

    return { success: true, data: { period: { startDate, endDate }, changes: grouped, totalChanges: logs.length } }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
