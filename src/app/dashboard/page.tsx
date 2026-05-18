'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/Forms'
import { KPICard, StatBadge } from '@/components/ui/Cards'

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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="px-8 py-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-white mb-2">ALIGNIQ Dashboard</h1>
            <p className="text-slate-400">AI-powered performance intelligence</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto">
        {/* KPI Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <motion.div variants={item}>
            <KPICard
              title="Goals Completed"
              value={12}
              unit="of 15"
              trend={{ direction: 'up', percentage: 8 }}
            />
          </motion.div>
          <motion.div variants={item}>
            <KPICard
              title="Team Alignment"
              value={92}
              unit="%"
              trend={{ direction: 'up', percentage: 3 }}
            />
          </motion.div>
          <motion.div variants={item}>
            <KPICard
              title="On-Track Goals"
              value={34}
              unit="of 45"
              trend={{ direction: 'down', percentage: 2 }}
            />
          </motion.div>
          <motion.div variants={item}>
            <KPICard
              title="Risk Flags"
              value={3}
              unit="escalations"
              trend={{ direction: 'down', percentage: 5 }}
            />
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 mb-8"
        >
          <div className="flex gap-4 border-b border-white/10 pb-4 mb-6">
            {['Overview', 'Goals', 'Team', 'Analytics'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2 font-semibold transition-all ${
                  activeTab === tab.toLowerCase()
                    ? 'text-purple-400 border-b-2 border-purple-400 -mb-4'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <StatBadge label="Q1 Progress" value="67%" variant="primary" />
                <StatBadge label="Team Efficiency" value="4.2/5" variant="success" />
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Your team is tracking well this quarter. 12 goals completed with 3 at-risk items requiring manager attention. 
                AI insights suggest focusing on delayed deliverables in the engineering department.
              </p>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-white">Q1 Revenue Target</p>
                    <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-200 rounded">On Track</span>
                  </div>
                  <p className="text-sm text-slate-400">Weight: 30%</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-3">
              {['Engineering', 'Product', 'Design', 'Marketing'].map(dept => (
                <div key={dept} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex justify-between mb-2">
                    <p className="font-semibold text-white">{dept}</p>
                    <span className="text-sm text-slate-400">8 goals</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-2 gap-4">
              <StatBadge label="Avg Completion" value="78%" variant="success" />
              <StatBadge label="Overdue Items" value="2" variant="warning" />
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4"
        >
          <Link href="/goals/create" className="flex-1">
            <Button variant="primary" size="lg" className="w-full">Create New Goal</Button>
          </Link>
          <Link href="/analytics" className="flex-1">
            <Button variant="glass" size="lg" className="w-full">View Analytics</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
