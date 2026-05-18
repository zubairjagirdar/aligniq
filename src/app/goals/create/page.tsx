'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button, Input, Select, Textarea } from '@/components/ui/Forms'
import { StatBadge } from '@/components/ui/Cards'

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

export default function CreateGoalPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: 0,
    unit: '',
    weight: 0,
    type: 'MIN'
  })

  const [totalWeight, setTotalWeight] = useState(0)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'weight' || name === 'targetValue' ? parseFloat(value) : value
    }))

    if (name === 'weight') {
      setTotalWeight(prev => prev + (parseFloat(value) || 0))
    }
  }

  const canAdd = totalWeight + formData.weight <= 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="px-8 py-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-white mb-2">Create Goal</h1>
            <p className="text-slate-400">Set quarterly OKRs aligned with team objectives</p>
          </motion.div>
        </div>
      </div>

      <div className="p-8 max-w-2xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="glass rounded-xl p-8"
        >
          {/* Weightage Info */}
          <motion.div variants={item} className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-blue-200">Total Weightage</p>
              <span className={`text-lg font-bold ${
                totalWeight + formData.weight <= 100 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {(totalWeight + formData.weight).toFixed(0)}% / 100%
              </span>
            </div>
            <p className="text-sm text-blue-300">
              {totalWeight === 0 ? 'Add goals to calculate total weightage' : 'Minimum 10% per goal, maximum 8 goals per quarter'}
            </p>
          </motion.div>

          {/* Form */}
          <form className="space-y-6">
            <motion.div variants={item}>
              <Input
                label="Goal Title"
                name="title"
                placeholder="e.g., Increase Monthly Recurring Revenue"
                value={formData.title}
                onChange={handleChange}
              />
            </motion.div>

            <motion.div variants={item}>
              <Textarea
                label="Description (Optional)"
                name="description"
                placeholder="Provide context and business rationale..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </motion.div>

            <motion.div variants={item} className="grid grid-cols-2 gap-4">
              <Input
                label="Target Value"
                name="targetValue"
                type="number"
                placeholder="100"
                value={formData.targetValue}
                onChange={handleChange}
              />
              <Input
                label="Unit of Measurement"
                name="unit"
                placeholder="e.g., $K, %"
                value={formData.unit}
                onChange={handleChange}
              />
            </motion.div>

            <motion.div variants={item} className="grid grid-cols-2 gap-4">
              <Input
                label="Weight (%)"
                name="weight"
                type="number"
                min="10"
                max="100"
                placeholder="25"
                value={formData.weight}
                onChange={handleChange}
              />
              <Select
                label="Goal Type"
                name="type"
                options={[
                  { value: 'MIN', label: 'MIN - Higher is better' },
                  { value: 'MAX', label: 'MAX - Lower is better' },
                  { value: 'ZERO', label: 'ZERO - Zero is ideal' },
                  { value: 'TIMELINE', label: 'TIMELINE - Date-based' }
                ]}
                value={formData.type}
                onChange={handleChange}
              />
            </motion.div>

            <motion.div variants={item}>
              <StatBadge
                label="Validation Status"
                value={canAdd ? 'Ready' : 'Exceeds limit'}
                variant={canAdd ? 'success' : 'danger'}
              />
            </motion.div>

            <motion.div variants={item} className="flex gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                disabled={!canAdd}
                onClick={() => router.push('/dashboard')}
                className="flex-1"
              >
                Create Goal
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button
                  variant="glass"
                  size="lg"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </Link>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
