// API response wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination
export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  pages: number
}

// Goal creation payload
export interface CreateGoalPayload {
  title: string
  description?: string
  targetValue: number
  unit: string
  weight: number
  type: 'MIN' | 'MAX' | 'ZERO' | 'TIMELINE'
  startDate?: string
  endDate?: string
}

// Goal approval payload
export interface ApproveGoalPayload {
  goalId: string
  approved: boolean
  comment?: string
}

// Checkin payload
export interface CreateCheckinPayload {
  goalId: string
  progress: number
  notes?: string
}

// Shared goal assignment
export interface AssignSharedGoalPayload {
  title: string
  targetValue: number
  unit: string
  userWeights: Record<string, number> // userId -> weight
}
