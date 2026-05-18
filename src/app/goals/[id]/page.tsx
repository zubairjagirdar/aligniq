'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button, Input, Textarea } from '@/components/ui/Forms'
import { ProgressBar } from '@/components/ui/Cards'

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

export default function GoalDetailPage({ params }: any) {
  const [progress, setProgress] = useState(65)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitCheckin = async () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setNotes('')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="px-8 py-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-white mb-2">Q1 Revenue Growth</h1>
            <p className="text-slate-400">30% weight • Engineering Department</p>
          </motion.div>
        </div>
      </div>

      <div className="p-8 max-w-4xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Goal Overview */}
          <motion.div variants={item} className="glass rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Goal Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Target</p>
                <p className="text-2xl font-bold text-white">$500K</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Status</p>
                <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-200 rounded-full text-sm font-semibold">
                  On Track
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Goal Type</p>
                <p className="text-lg font-semibold text-white">MIN</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Weight</p>
                <p className="text-2xl font-bold text-purple-400">30%</p>
              </div>
            </div>
          </motion.div>

          {/* Progress */}
          <motion.div variants={item} className="glass rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Current Progress</h2>
            <ProgressBar value={progress} max={100} animated />
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <p className="text-sm text-slate-300">
                <strong>Current Value:</strong> $325K (65% of target)
              </p>
              <p className="text-sm text-slate-300 mt-2">
                <strong>Trend:</strong> ↑ +$45K this month
              </p>
            </div>
          </motion.div>

          {/* Check-in Form */}
          <motion.div variants={item} className="glass rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Submit Check-in</h2>
            <form className="space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-3">
                  Progress Update (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-slate-400">0%</span>
                  <span className="text-lg font-bold text-purple-400">{progress}%</span>
                  <span className="text-sm text-slate-400">100%</span>
                </div>
              </div>

              <Textarea
                label="Notes & Comments"
                placeholder="What's the status? Any blockers or wins to share?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />

              <div className="flex gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="flex-1"
                  onClick={handleSubmitCheckin}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Check-in'}
                </Button>
                <Button variant="glass" size="lg" className="flex-1" onClick={() => setNotes('')}>
                  Save Draft
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Recent Check-ins */}
          <motion.div variants={item} className="glass rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Recent Check-ins</h2>
            <div className="space-y-4">
              {[
                { date: '2 days ago', progress: 60, note: 'Closed 3 major deals' },
                { date: '1 week ago', progress: 45, note: 'Pipeline ramping up' },
                { date: '2 weeks ago', progress: 30, note: 'Initial kickoff' }
              ].map((checkin, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-slate-400">{checkin.date}</p>
                    <span className="text-lg font-bold text-purple-400">{checkin.progress}%</span>
                  </div>
                  <p className="text-slate-300">{checkin.note}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
