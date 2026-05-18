'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/Forms'
import { AnimatedLineChart, AnimatedPieChart, AnimatedBarChart } from '@/components/ui/Charts'

const mockLineData = [
  { name: 'Week 1', value: 20 },
  { name: 'Week 2', value: 35 },
  { name: 'Week 3', value: 50 },
  { name: 'Week 4', value: 65 }
]

const mockPieData = [
  { name: 'Completed', value: 45 },
  { name: 'On Track', value: 35 },
  { name: 'At Risk', value: 15 },
  { name: 'Not Started', value: 5 }
]

const mockBarData = [
  { name: 'Engineering', value: 78 },
  { name: 'Product', value: 85 },
  { name: 'Design', value: 92 },
  { name: 'Marketing', value: 68 }
]

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="px-8 py-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics & Insights</h1>
            <p className="text-slate-400">AI-powered performance metrics and predictive insights</p>
          </motion.div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="space-y-8"
        >
          {/* KPI Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            {[
              { label: 'Org Completion', value: '72%', color: 'emerald' },
              { label: 'Avg Progress', value: '68%', color: 'purple' },
              { label: 'At-Risk Goals', value: '8', color: 'amber' },
              { label: 'Manager Efficiency', value: '4.2/5', color: 'cyan' }
            ].map((kpi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-xl"
              >
                <p className="text-sm text-slate-400 mb-2">{kpi.label}</p>
                <p className={`text-3xl font-bold text-${kpi.color}-400`}>{kpi.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <AnimatedLineChart
              data={mockLineData}
              title="Progress Trend (Q1)"
              height={300}
            />
            <AnimatedPieChart
              data={mockPieData}
              title="Goal Status Distribution"
              height={300}
            />
          </motion.div>

          {/* Department Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AnimatedBarChart
              data={mockBarData}
              title="Department Completion Rates"
              height={300}
            />
          </motion.div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-4">🤖 AI Insights</h2>
            <div className="space-y-3">
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <p className="font-semibold text-purple-200 mb-1">Risk Alert: Revenue Goal</p>
                <p className="text-sm text-slate-300">3 team members show low progress velocity. Recommend manager check-in.</p>
              </div>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <p className="font-semibold text-emerald-200 mb-1">Positive Trend: Product Team</p>
                <p className="text-sm text-slate-300">Product team exceeded quarterly targets by 15%. On track for excellence rating.</p>
              </div>
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="font-semibold text-amber-200 mb-1">Deadline Approaching</p>
                <p className="text-sm text-slate-300">5 goals due in next 7 days with {'<50%'} completion. Escalate to managers.</p>
              </div>
            </div>
          </motion.div>

          {/* Export Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
            <Button variant="primary" size="lg" onClick={() => alert('Report exported successfully')}>Export Report</Button>
            <Button variant="glass" size="lg" onClick={() => alert('Email scheduled for tomorrow 9 AM')}>Schedule Email</Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
