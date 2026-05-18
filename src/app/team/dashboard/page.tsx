'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button, Input } from '@/components/ui/Forms'
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

interface TeamMember {
  id: string
  name: string
  role: string
  goalsSet: number
  completed: number
  status: 'on-track' | 'at-risk' | 'completed'
}

export default function ManagerDashboard() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Emily Rodriguez',
      role: 'Senior Engineer',
      goalsSet: 6,
      completed: 4,
      status: 'on-track'
    },
    {
      id: '2',
      name: 'David Kim',
      role: 'Product Manager',
      goalsSet: 5,
      completed: 2,
      status: 'at-risk'
    },
    {
      id: '3',
      name: 'Sarah Mitchell',
      role: 'Designer',
      goalsSet: 4,
      completed: 4,
      status: 'completed'
    },
    {
      id: '4',
      name: 'James Park',
      role: 'Engineer',
      goalsSet: 6,
      completed: 3,
      status: 'on-track'
    }
  ]

  const filteredMembers = teamMembers.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="px-8 py-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-white mb-2">Team Dashboard</h1>
            <p className="text-slate-400">Manage your team's goals, approvals & performance</p>
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
          {/* Team KPIs */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Team Size', value: '12', trend: '+2 this Q' },
              { label: 'Avg Completion', value: '73%', trend: '↑ +5%' },
              { label: 'Goals Pending Approval', value: '5', trend: 'Review today' },
              { label: 'Team Health', value: 'Good', trend: 'On track' }
            ].map((kpi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-xl"
              >
                <p className="text-sm text-slate-400 mb-1">{kpi.label}</p>
                <p className="text-3xl font-bold text-white mb-2">{kpi.value}</p>
                <p className="text-xs text-slate-500">{kpi.trend}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Team Members */}
          <motion.div variants={item} className="glass rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Team Members</h2>

            {/* Search */}
            <Input
              placeholder="Search team member..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-6"
            />

            {/* Members List */}
            <div className="space-y-3">
              {filteredMembers.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedMember(member)}
                  className="p-4 bg-white/5 border border-white/10 hover:border-white/20 rounded-lg cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-white">{member.name}</p>
                      <p className="text-sm text-slate-400">{member.role}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      member.status === 'completed' ? 'bg-emerald-500/20 text-emerald-200' :
                      member.status === 'on-track' ? 'bg-blue-500/20 text-blue-200' :
                      'bg-red-500/20 text-red-200'
                    }`}>
                      {member.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs text-slate-400">
                        {member.completed} of {member.goalsSet} completed
                      </p>
                      <p className="text-xs font-bold text-slate-300">
                        {Math.round((member.completed / member.goalsSet) * 100)}%
                      </p>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                        style={{ width: `${(member.completed / member.goalsSet) * 100}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pending Approvals */}
          <motion.div variants={item} className="glass rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Pending Goal Approvals</h2>

            <div className="space-y-4">
              {[
                {
                  id: 1,
                  employee: 'Emily Rodriguez',
                  goal: 'Increase API performance by 40%',
                  weight: 25,
                  submittedAt: '2 hours ago'
                },
                {
                  id: 2,
                  employee: 'David Kim',
                  goal: 'Launch mobile app MVP',
                  weight: 35,
                  submittedAt: '30 minutes ago'
                },
                {
                  id: 3,
                  employee: 'James Park',
                  goal: 'Reduce bug report backlog by 50%',
                  weight: 20,
                  submittedAt: '5 minutes ago'
                }
              ].map((approval, i) => (
                <motion.div
                  key={approval.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div className="mb-3">
                    <p className="font-semibold text-white">{approval.goal}</p>
                    <p className="text-sm text-slate-400">By {approval.employee}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <StatBadge label="Weight" value={`${approval.weight}%`} variant="primary" />
                      <p className="text-xs text-slate-500 px-3 py-1 bg-white/5 rounded-full">
                        {approval.submittedAt}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="glass"
                        size="sm"
                        onClick={() => alert(`Discussion with ${approval.employee} scheduled`)}
                      >
                        Discuss
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setShowApprovalModal(true)}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={item} className="flex gap-4">
            <Button variant="primary" size="lg" className="flex-1" onClick={() => alert('1:1 meetings scheduled')}>
              Schedule 1:1 Meetings
            </Button>
            <Button variant="glass" size="lg" className="flex-1" onClick={() => alert('Team update sent')}>
              Send Team Update
            </Button>
            <Button variant="glass" size="lg" className="flex-1" onClick={() => alert('Reports page opened')}>
              View Reports
            </Button>
          </motion.div>
        </motion.div>

        {/* Member Detail Modal */}
        <Modal
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          title={selectedMember?.name || 'Team Member'}
          size="lg"
          actions={
            <div className="flex gap-3">
              <Button variant="glass" size="md" onClick={() => alert('1:1 check-in scheduled')}>1:1 Check-in</Button>
              <Button variant="primary" size="md" onClick={() => alert('Goals view opened')}>View Goals</Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Role</p>
              <p className="font-semibold text-white">{selectedMember?.role}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Status</p>
              <p className="font-semibold text-white capitalize">
                {selectedMember?.status.replace('-', ' ')}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-2">Goal Progress</p>
              <div className="space-y-2">
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                    style={{
                      width: `${selectedMember ? (selectedMember.completed / selectedMember.goalsSet) * 100 : 0}%`
                    }}
                  />
                </div>
                <p className="text-sm text-slate-300">
                  {selectedMember?.completed} of {selectedMember?.goalsSet} goals completed
                </p>
              </div>
            </div>
          </div>
        </Modal>

        {/* Approval Modal */}
        <Modal
          isOpen={showApprovalModal}
          onClose={() => setShowApprovalModal(false)}
          title="Approve Goal"
          size="md"
          actions={
            <div className="flex gap-3">
              <Button variant="glass" size="md" onClick={() => setShowApprovalModal(false)}>
                Reject
              </Button>
              <Button variant="primary" size="md" onClick={() => setShowApprovalModal(false)}>
                Approve
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-slate-300">
              Are you ready to approve this goal? Once approved, it will be locked and the employee can start tracking progress.
            </p>
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-200">
                💡 Tip: Add a comment to provide feedback before approving.
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
