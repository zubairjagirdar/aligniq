'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

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

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 flex items-center justify-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(107,92,231,0.03)_1px,transparent_1px)] bg-[length:40px_40px]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative text-center z-10"
      >
        <motion.div variants={item}>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent mb-6">
            ALIGNIQ
          </h1>
        </motion.div>

        <motion.div variants={item}>
          <p className="text-xl text-slate-300 mb-12 max-w-lg">
            AI-Powered Goal Setting & Performance Intelligence Operating System
          </p>
        </motion.div>

        <motion.div
          variants={item}
          className="flex gap-4 justify-center"
        >
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Start Building
          </Link>
          <Link
            href="/analytics"
            className="px-8 py-3 glass text-slate-200 rounded-lg font-semibold hover:bg-white/10 transition-all"
          >
            Learn More
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
