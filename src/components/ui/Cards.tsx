'use client'

import { motion } from 'framer-motion'
import React from 'react'

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  trend?: { direction: 'up' | 'down'; percentage: number }
  icon?: React.ReactNode
  className?: string
}

export const KPICard = React.memo(function KPICard({
  title,
  value,
  unit,
  trend,
  icon,
  className = ''
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass p-6 rounded-xl ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-slate-400 font-medium">{title}</p>
        {icon && <div className="text-purple-400">{icon}</div>}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{value}</span>
          {unit && <span className="text-sm text-slate-400">{unit}</span>}
        </div>

        {trend && (
          <div className={`text-sm font-medium ${
            trend.direction === 'up' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.percentage}%
          </div>
        )}
      </div>
    </motion.div>
  )
})

interface StatBadgeProps {
  label: string
  value: string | number
  variant?: 'primary' | 'success' | 'warning' | 'danger'
}

export const StatBadge = React.memo(function StatBadge({
  label,
  value,
  variant = 'primary'
}: StatBadgeProps) {
  const bgMap = {
    primary: 'bg-purple-500/20 text-purple-200',
    success: 'bg-emerald-500/20 text-emerald-200',
    warning: 'bg-amber-500/20 text-amber-200',
    danger: 'bg-red-500/20 text-red-200'
  }

  return (
    <div className={`px-4 py-2 rounded-lg ${bgMap[variant]} text-sm font-semibold`}>
      {label}: <span className="font-bold">{value}</span>
    </div>
  )
})

interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  animated?: boolean
}

export const ProgressBar = React.memo(function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  animated = true
}: ProgressBarProps) {
  const percentage = (value / max) * 100

  return (
    <div className="w-full space-y-2">
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={animated ? { width: 0 } : undefined}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
        />
      </div>
      {showLabel && (
        <div className="text-xs text-slate-400 flex justify-between">
          <span>Progress</span>
          <span className="font-semibold text-slate-200">{percentage.toFixed(0)}%</span>
        </div>
      )}
    </div>
  )
})
