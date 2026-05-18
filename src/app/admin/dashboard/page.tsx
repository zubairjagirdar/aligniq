'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/Forms'
import { StatBadge } from '@/components/ui/Cards'
import { Modal } from '@/components/ui/Layout'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function AdminDashboard() {
  const [selectedEscalation, setSelectedEscalation] = useState<any>(null)

  const escalations = [
    {
      id: 1,
      employee: 'Emily Rodriguez',
      goal: 'Q1 Revenue Growth',
      reason: 'No update in 14 days',
      severity: 'high',
      escalatedAt: '2 hours ago'
    },
    {
      id: 2,
      employee: 'David Kim',
      goal: 'Product v2.0 Launch',
      reason: 'Deadline in 10 days, 0% progress',
      severity: 'critical',
      escalatedAt: '1 hour ago'
    },
    {
      id: 3,
      employee: 'Alex Chen',
      goal: 'Customer Support SLA',
      reason: 'Manager approval pending 5 days',
      severity: 'medium',
      escalatedAt: '30 minutes ago'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="px-8 py-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Organization-wide governance & escalation management</p>
          </motion.div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Organization KPIs */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Employees', value: '245', color: 'purple' },
              { label: 'Goals Created', value: '1,240', color: 'cyan' },
              { label: 'Completion Rate', value: '72%', color: 'emerald' },
              { label: 'Active Escalations', value: '8', color: 'red' }
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

          {/* Escalations Management */}
          <motion.div variants={item} className="glass rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              🚨 Active Escalations
              <span className="text-sm px-2 py-1 bg-red-500/20 text-red-200 rounded-full">
                {escalations.length} pending
              </span>
            </h2>

            <div className="space-y-4">
              {escalations.map((esc, i) => (
                <motion.div
                  key={esc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedEscalation(esc)}
                  className="p-4 bg-white/5 border border-white/10 hover:border-white/20 rounded-lg cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-white">{esc.employee}</p>
                      <p className="text-sm text-slate-400">{esc.goal}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      esc.severity === 'critical' ? 'bg-red-500/20 text-red-200' :
                      esc.severity === 'high' ? 'bg-orange-500/20 text-orange-200' :
                      'bg-yellow-500/20 text-yellow-200'
                    }`}>
                      {esc.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-sm text-slate-300">{esc.reason}</p>
                    <p className="text-xs text-slate-500">{esc.escalatedAt}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Shared Goals Setup */}
          <motion.div variants={item} className="glass rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-4">Departmental KPIs</h2>
            <div className="space-y-3">
              {[
                { title: 'Q1 Revenue Target', departments: ['Sales', 'Eng', 'Product'], linked: 45 },
                { title: 'Customer Satisfaction', departments: ['Support', 'Product', 'Ops'], linked: 32 },
                { title: 'Team Retention', departments: ['HR', 'Eng', 'Design'], linked: 28 }
              ].map((kpi, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-white">{kpi.title}</p>
                      <div className="flex gap-2 mt-2">
                        {kpi.departments.map(dept => (
                          <span key={dept} className="text-xs px-2 py-1 bg-purple-500/20 text-purple-200 rounded">
                            {dept}
                          </span>
                        ))}
                      </div>
                    </div>
                    <StatBadge label="Linked" value={kpi.linked} variant="primary" />
                  </div>
                </motion.div>
              ))}
            </div>
            <Button variant="primary" size="lg" className="w-full mt-6" onClick={() => alert('New shared goal creation form coming soon')}>
              Create New Shared Goal
            </Button>
          </motion.div>

          {/* Audit Trail */}
          <motion.div variants={item} className="glass rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-4">Recent Changes (Audit Log)</h2>
            <div className="space-y-2 text-sm text-slate-300">
              {[
                { time: '5 min ago', action: 'Emily Rodriguez', entity: 'Goal: Q1 Revenue', change: 'Progress: 60% → 65%' },
                { time: '12 min ago', action: 'Admin Sarah Chen', entity: 'Shared Goal', change: 'Created Org Revenue KPI' },
                { time: '1 hour ago', action: 'Manager Marcus', entity: 'Goal: Product Launch', change: 'Status: NOT_STARTED → ON_TRACK' },
                { time: '2 hours ago', action: 'David Kim', entity: 'Checkin', change: 'Submitted weekly update' }
              ].map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <div>
                    <p className="font-medium text-slate-200">{log.action}</p>
                    <p className="text-xs text-slate-500">{log.entity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-300">{log.change}</p>
                    <p className="text-xs text-slate-500">{log.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <Button variant="glass" size="lg" className="w-full mt-6" onClick={() => alert('Compliance report downloaded')}>
              Export Compliance Report
            </Button>
          </motion.div>

          {/* Escalation Modal */}
          <Modal
            isOpen={!!selectedEscalation}
            onClose={() => setSelectedEscalation(null)}
            title={selectedEscalation?.goal || 'Goal Escalation'}
            size="lg"
            actions={
              <div className="flex gap-3">
                <Button variant="glass" size="md">Mark Resolved</Button>
                <Button variant="primary" size="md">Take Action</Button>
              </div>
            }
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Employee</p>
                <p className="font-semibold text-white">{selectedEscalation?.employee}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Reason</p>
                <p className="text-slate-200">{selectedEscalation?.reason}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Severity</p>
                <StatBadge
                  label="Level"
                  value={selectedEscalation?.severity}
                  variant={selectedEscalation?.severity === 'critical' ? 'danger' : 'warning'}
                />
              </div>
            </div>
          </Modal>
        </motion.div>
      </div>
    </div>
  )
}
