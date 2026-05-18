import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types/api'

// AI risk prediction engine
export async function predictGoalRisk(goalId: string): Promise<ApiResponse<{ score: number; factors: string[] }>> {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: { checkins: { orderBy: { createdAt: 'desc' }, take: 10 } }
    })

    if (!goal) {
      return { success: false, error: 'Goal not found' }
    }

    let riskScore = 0
    const factors: string[] = []

    // Factor 1: No recent progress (last 2 weeks)
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    const recentCheckins = goal.checkins.filter(c => c.createdAt > twoWeeksAgo)
    
    if (recentCheckins.length === 0) {
      riskScore += 30
      factors.push('No progress updates in 2 weeks')
    }

    // Factor 2: Deadline approaching
    if (goal.endDate) {
      const daysUntilDeadline = Math.ceil((goal.endDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
      if (daysUntilDeadline < 7 && goal.status !== 'COMPLETED') {
        riskScore += 25
        factors.push(`Deadline in ${daysUntilDeadline} days`)
      }
    }

    // Factor 3: Low progress velocity
    if (goal.checkins.length >= 3) {
      const latestProgress = goal.checkins[0].progress
      const oldestProgress = goal.checkins[goal.checkins.length - 1].progress
      const progressGain = latestProgress - oldestProgress
      
      if (progressGain < 20) {
        riskScore += 20
        factors.push('Low progress velocity')
      }
    }

    // Factor 4: Goal status
    if (goal.status === 'NOT_STARTED') {
      riskScore += 15
      factors.push('Goal not started')
    }

    // Save AI insight
    await prisma.aIInsight.create({
      data: {
        goalId,
        type: 'risk_prediction',
        score: Math.min(riskScore, 100),
        payload: { factors, timestamp: new Date() }
      }
    })

    return {
      success: true,
      data: {
        score: Math.min(riskScore, 100),
        factors
      }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// AI summary generation (quarterly)
export async function generateQuarterlySummary(userId: string): Promise<ApiResponse<string>> {
  try {
    const goals = await prisma.goal.findMany({
      where: { ownerId: userId },
      include: { checkins: true }
    })

    if (goals.length === 0) {
      return {
        success: true,
        data: 'No goals tracked this quarter'
      }
    }

    const completedCount = goals.filter(g => g.status === 'COMPLETED').length
    const completionRate = (completedCount / goals.length) * 100
    
    const avgWeight = goals.reduce((sum, g) => sum + g.weight, 0) / goals.length
    const totalCheckins = goals.reduce((sum, g) => sum + g.checkins.length, 0)

    const summary = `
      Q1 Performance Summary:
      - Goals Completed: ${completedCount}/${goals.length} (${completionRate.toFixed(0)}%)
      - Average Goal Weight: ${avgWeight.toFixed(1)}%
      - Total Check-ins: ${totalCheckins}
      - Consistency: ${totalCheckins > 0 ? 'High' : 'Low'}
    `.trim()

    return { success: true, data: summary }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Manager effectiveness analysis
export async function analyzeManagerEffectiveness(managerId: string): Promise<ApiResponse<any>> {
  try {
    const reports = await prisma.user.findMany({
      where: {
        // In a real implementation, track manager relationships
      },
      include: {
        goals: {
          include: { checkins: true }
        }
      }
    })

    const metricsMap = reports.map(employee => ({
      name: employee.name,
      goalsSet: employee.goals.length,
      completed: employee.goals.filter(g => g.status === 'COMPLETED').length,
      avgProgress: employee.goals.length > 0
        ? employee.goals.reduce((sum, g) => sum + (g.checkins[0]?.progress || 0), 0) / employee.goals.length
        : 0
    }))

    return {
      success: true,
      data: {
        teamSize: reports.length,
        avgCompletion: metricsMap.reduce((sum, m) => sum + (m.completed / (m.goalsSet || 1)), 0) / metricsMap.length,
        metrics: metricsMap
      }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Productivity trend analysis
export async function analyzeTrends(userId: string, days: number = 30): Promise<ApiResponse<any>> {
  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const checkins = await prisma.checkin.findMany({
      where: {
        authorId: userId,
        createdAt: { gte: since }
      },
      orderBy: { createdAt: 'asc' }
    })

    const weeklyData = []
    for (let i = 0; i < days; i += 7) {
      const weekStart = new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000)
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      
      const weekCheckins = checkins.filter(c => c.createdAt >= weekStart && c.createdAt < weekEnd)
      weeklyData.push({
        week: weekStart.toISOString().split('T')[0],
        checkinCount: weekCheckins.length,
        avgProgress: weekCheckins.length > 0
          ? weekCheckins.reduce((sum, c) => sum + c.progress, 0) / weekCheckins.length
          : 0
      })
    }

    return { success: true, data: weeklyData }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
