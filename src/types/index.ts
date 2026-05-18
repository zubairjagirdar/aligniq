// Core enterprise types
export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE'

export type GoalType = 'MIN' | 'MAX' | 'ZERO' | 'TIMELINE'

export type GoalStatus = 'NOT_STARTED' | 'ON_TRACK' | 'COMPLETED'

export interface User {
  id: string
  email: string
  name?: string
  role: Role
  createdAt: Date
  updatedAt: Date
}

export interface Goal {
  id: string
  ownerId: string
  title: string
  description?: string | null
  targetValue: number
  unit: string
  weight: number
  type: GoalType
  status: GoalStatus
  startDate?: Date | null
  endDate?: Date | null
  sharedGoalId?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface SharedGoal {
  id: string
  title: string
  description?: string | null
  targetValue: number
  unit: string
  owners?: SharedGoalOwner[]
  createdAt: Date
}

export interface SharedGoalOwner {
  id: string
  sharedId: string
  userId: string
  weight: number
}

export interface Checkin {
  id: string
  goalId: string
  authorId: string
  progress: number
  notes?: string | null
  createdAt: Date
}

export interface AuditLog {
  id: string
  actorId: string
  entityType: string
  entityId: string
  field: string
  oldValue?: string
  newValue?: string
  timestamp: Date
}

export interface Notification {
  id: string
  userId: string
  type: string
  payload: Record<string, any>
  read: boolean
  createdAt: Date
}

export interface AIInsight {
  id: string
  goalId: string
  type: string
  score: number
  payload: Record<string, any>
  createdAt: Date
}
